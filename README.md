## 실행방법

- 우선 아래 명령어로 패키지를 설치합니다.

  ```bash
  $ npm install
  ```


- 환경변수 설정을 위해, `.env` 혹은 `.env.development`를 생성합니다. root 경로의 `env.development`나 `env.production` 파일을 참고하시면 됩니다.

- 환경변수 설정이 완료되면, DB 생성을 위해, `app.module.ts` 파일의 `TypeOrmModule.forRoot({ })` 옵션에서 `synchronize: true`를 설정한 뒤 app을 실행합니다. 실행 명령어는 아래를 참고하시면 됩니다.

  ```bash
  # development
  $ npm run start

  # watch mode
  $ npm run start:dev

  # production mode
  $ npm run start:prod
  ```


- DB 테이블 생성이 완료되면, **PostCategory** 테이블에 데이터를 추가해주셔야 합니다. 해당 테이블은 외래키로 참조되고 있어서 데이터가 없을 경우 에러가 발생합니다. 데이터를 추가하시면, `TypeOrmModule.forRoot({ })`에서 `synchronize: fasle` 옵션을 설정합니다.

  ```sql
  # 데이터 추가
  INSERT INTO PostCategory VALUES(1, '공지')
  INSERT INTO PostCategory VALUES(2, '질문')
  ```


- 쉘에서 실행 명령어를 입력하여 다시 app을 실행합니다. **http://localhost:{PORT}/api** 로 접속하시면 swagger api 문서 확인이 가능합니다.


- DB 모델링 전체 구조를 확인하시려면 root 경로의 **CLASSUM_ERD.png** 파일을 참고하시면 됩니다.
