# pack-consumer — tarball 전용 소비 검증

`examples/consumer` 는 워크스페이스 **심볼릭 링크**(`file:../..`)로 레포를 가리키지만,
여기는 **`npm pack` 으로 만든 실제 배포 tarball 만 설치**해 검증한다. 즉 npm 에 올라갈
알맹이(dist + package.json + README)와 1:1 — `files` 경계·exports·ESM/CJS 해석을
소비자 관점에서 그대로 확인한다.

## 실행 (레포 루트에서)

```bash
node scripts/pack-test.mjs   # build:lib → npm pack → tarball 을 여기 설치
node examples/pack-consumer/smoke.mjs   # 설치된 tarball 검증(ESM/CJS/styles/files 경계)
```

시각으로 보려면:

```bash
npm --prefix examples/pack-consumer run dev   # http://localhost:5175
```

CI(`.github/workflows/smoke.yml`)가 PR 마다 위 두 단계를 자동 실행한다.

> 워크스페이스에 포함하지 않으므로(루트 `workspaces` 에 없음) 심볼릭 링크가 생기지 않는다.
