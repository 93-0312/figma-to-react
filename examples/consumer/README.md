# consumer 예시 + 스모크 테스트

`@eromnet/bo-ui-kit` 을 **외부 React 프로젝트처럼** 설치·사용하는 최소 예시.
워크스페이스로 링크돼 있어, 라이브러리(빌드/exports/스타일)가 소비자 관점에서
깨지면 스모크 테스트가 잡아낸다.

## 실행 (레포 루트에서)

```bash
npm install            # 워크스페이스 링크
npm run build:lib      # 라이브러리 dist 빌드 (예시가 이걸 import)
npm --prefix examples/consumer run dev    # http://localhost:5174
```

## 스모크 테스트

```bash
# 별도 터미널에서 dev 서버를 띄운 뒤
node examples/consumer/smoke.mjs
```

브라우저로 실제 렌더해 Default 버튼 = primary 색, Meter 인디케이터, InputOTP 슬롯 등을
단언한다. CI(`.github/workflows/smoke.yml`)가 PR 마다 자동 실행한다.

> 이 예시는 `src/App.tsx` 가 라이브러리 사용법(컴포넌트 import + `styles.css` 한 줄) 그대로다.
