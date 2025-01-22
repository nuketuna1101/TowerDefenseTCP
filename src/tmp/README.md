tmp 폴더의 개설 이유

=> 파일 디렉토리 정리는 차후 리팩토링 과정에서 하기위해

=> 일단 담당 파트인 tower 에 관해서 파일 위치 상관없이 구조만 분리하여 작성하기 위함

<br>

기본 구성 요소

TowerController: client request의 처리

TowerService: 비즈니스 로직의 담당

tower.model: 데이터 구조로서의 타워 정의

(이 프로젝트의 경우, 타워와 관련한 DB 관리는 없기 때문에 TowerRepository는 생략)