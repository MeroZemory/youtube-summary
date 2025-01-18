import { NextResponse } from 'next/server';
import {create as createYoutubeDl } from 'youtube-dl-exec';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { TranscriptionResponse, Segment } from '@/app/types';
import { exec } from 'child_process';

const youtubedl = createYoutubeDl('C:/yt-dlp/yt-dlp.exe');

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // 필요에 따라 추가적인 로깅이나 에러 처리 로직을 여기에 추가할 수 있습니다.
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    console.log('API 호출 시작');
    const { url } = await req.json();
    console.log('받은 URL:', url);
    
    // // 유튜브 메타데이터 가져오기
    // console.log('유튜브 메타데이터 가져오기 시작');
    // const videoInfo = await ytdl.getInfo(url);
    
    // // 멤버십 전용 동영상 체크
    // if (videoInfo.videoDetails.isPrivate) {
    //   return NextResponse.json(
    //     { error: '비공개 동영상은 처리할 수 없습니다.' },
    //     { status: 403 }
    //   );
    // }

    // const { title, description } = videoInfo.videoDetails;
    // console.log('메타데이터:', { title, description });

    // 임시 파일 경로 설정
    const tempDir = path.join(process.cwd(), 'temp');
    console.log('임시 디렉토리 경로:', tempDir);
    if (!fs.existsSync(tempDir)) {
      console.log('임시 디렉토리 생성');
      fs.mkdirSync(tempDir);
    }
    
    // TODO: url 캐시

    // 비디오 다운로드
    const videoPath = path.join(tempDir, `${Date.now()}.webm`);
    await youtubedl(url, {
      output: videoPath,
      format: 'bestvideo+bestaudio/best',
    });

    // 파일 존재 여부 확인
    if (!fs.existsSync(videoPath)) {
      throw new Error(`비디오 파일이 존재하지 않습니다: ${videoPath}`);
    }

    // const audioPath = path.join(tempDir, `${Date.now()}.mp3`);
    // console.log('오디오 파일 경로:', audioPath);

    // // 오디오 다운로드 및 변환
    // await new Promise<void>((resolve, reject) => {
    //   const download = ytdl(url, { filter: 'audioonly' });
    //   const writeStream = fs.createWriteStream(audioPath);

    //   download.pipe(writeStream);

    //   download.on('error', (error) => {
    //     console.error('ytdl 다운로드 오류:', error);
    //     reject(error);
    //   });

    //   writeStream.on('close', resolve);
    //   writeStream.on('error', (error) => {
    //     console.error('파일 쓰기 오류:', error);
    //     reject(error);
    //   });
    // });

    // ffmpeg를 사용하여 오디오 추출 (압축된 형식으로)
    const audioPath = path.join(tempDir, `${Date.now()}.mp3`);
    await new Promise<void>((resolve, reject) => {
      // -ab: 비트레이트 설정 (64k = 64kbps)
      // -ac: 오디오 채널 수 (1 = 모노)
      // -ar: 샘플링 레이트 (16000 = 16kHz)
      exec(`ffmpeg -i ${videoPath} -vn -ab 64k -ac 1 -ar 16000 ${audioPath}`, (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          console.error('ffmpeg 오류:', error);
          console.error('ffmpeg stderr:', stderr);
          reject(error);
        } else {
          console.log('오디오 추출 완료');
          resolve();
        }
      });
    });

    // 오디오 파일을 여러 조각으로 나누기
    const segmentDir = path.join(tempDir, 'segments');
    if (!fs.existsSync(segmentDir)) {
      fs.mkdirSync(segmentDir);
    }
    await new Promise<void>((resolve, reject) => {
      exec(`ffmpeg -i ${audioPath} -f segment -segment_time 600 -c copy ${segmentDir}/output%03d.mp3`, (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          console.error('ffmpeg 분할 오류:', error);
          console.error('ffmpeg stderr:', stderr);
          reject(error);
        } else {
          console.log('오디오 분할 완료');
          resolve();
        }
      });
    });

    // 각 조각을 Whisper API로 처리
    const segmentFiles = fs.readdirSync(segmentDir).filter(file => file.endsWith('.mp3'));
    let fullTranscription = '';
    let totalDuration = 0;
    const allSegments: Segment[] = [];

    for (const segmentFile of segmentFiles) {
      const segmentPath = path.join(segmentDir, segmentFile);
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(segmentPath),
        model: "whisper-1",
        response_format: "verbose_json",
      }) as unknown as TranscriptionResponse;

      // 각 세그먼트의 타임스탬프를 조정
      transcription.segments.forEach(segment => {
        segment.start += totalDuration;
        segment.end += totalDuration;
        allSegments.push(segment);
      });

      // 전체 트랜스크립션 텍스트 합치기
      fullTranscription += transcription.text + ' ';

      // 현재 조각의 길이를 계산하여 총 길이에 추가
      const segmentDuration = transcription.segments.reduce((acc, segment) => acc + (segment.end - segment.start), 0);
      totalDuration += segmentDuration;
    }

    // 임시 파일 삭제
    fs.unlinkSync(audioPath);
    segmentFiles.forEach(file => fs.unlinkSync(path.join(segmentDir, file)));
    fs.rmdirSync(segmentDir);

    // GPT를 사용하여 요약 생성
    const summary = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes video content."
        },
        {
          role: "user",
          content: `다음 텍스트를 한국어로 요약해주세요: ${fullTranscription}`
        }
      ]
    });

    return NextResponse.json({
      summary: summary.choices[0].message.content,
      timestamps: allSegments.map(segment => ({
        time: new Date(segment.start * 1000).toISOString().substring(11, 19),
        text: segment.text
      }))
    });

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : '동영상 처리 중 오류가 발생했습니다.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 