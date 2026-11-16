// 튜토리얼: 코딩을 처음 하는 사람을 위한 코스 4개.
// 1에서 내 컴퓨터에 첫 화면을 만들고, 2에서 Git·GitHub로 저장하고, 3에서 인터넷에 공개하고,
// 4에서 개발자 도구로 혼자 화면을 살피고 고치는 법을 익힌다.
// 각 단계는 기존 용어(term id) 하나와 짝을 이룬다.
//   intro: lead 위에 보여줄 코스 소개 { text, shot }
//   lead: 이 용어를 지금 배우는 이유
//   todo / links / prompt / stuck: 직접 해볼 일이 있는 단계에만
// prev: 앞 코스에서 이어지는 코스의 첫 단계에 보여줄 안내
//   walk: 따라 하기 순서. text는 문단 배열이고 **굵게**를 쓸 수 있다.
//         shot은 public/tutorial/ 아래 스크린샷 파일 이름으로, SHOTS에 있을 때만 보여준다.
// 사내 강의에서 외부 호스팅(Vercel·GitHub 공개 등) 안내가 보안에 걸려 잠시 숨긴다. true로 바꾸면 다시 보인다
export const SHOW_TUTORIAL = true

export const TUTORIALS = [
  {
    title: '왕초보라면 여기부터 1',
    subtitle: 'AI로 내 컴퓨터에 첫 화면 만들기',
    road: ['시작', '준비', '만들기', '열어보기'],
    finish: '내 컴퓨터에 첫 화면이 생겼어요! 다음 코스에서는 만든 걸 잃어버리지 않게 저장하는 법을 배워요.',
    steps: [
      {
        term: 'vibe-coding',
        chapter: '시작하기',
        lead: '환영해요! 코딩을 한 줄도 몰라도 괜찮아요. 우리가 할 일은 코드를 외우는 게 아니라, 만들고 싶은 걸 AI에게 정확히 말하는 거예요. 이 방식을 바이브 코딩이라고 불러요. 이 코스를 마치면 내 컴퓨터에서 "우리 가게 소개 페이지"를 직접 열어볼 수 있어요.',
      },
      {
        term: 'prompt',
        chapter: '시작하기',
        lead: 'AI에게 하는 말을 프롬프트라고 해요. 튜토리얼 곳곳에 "AI에게 이렇게 보내보세요" 문장을 준비해 뒀는데, 그게 전부 프롬프트예요. 복사해서 쓰다 보면 어떻게 말해야 하는지 자연스럽게 익숙해져요.',
      },
      {
        term: 'ai-coding-tool',
        chapter: '준비하기',
        lead: '이제 AI 비서를 내 컴퓨터에 들일 차례예요. 휴대폰에 앱 하나 까는 것과 비슷해요. 설치가 끝나면 빈 폴더 하나를 만들어 그 안에서 작업을 시작해요.',
        todo: ['AI 코딩 도구를 설치해요 (예: Claude, ChatGPT, Antigravity 등)', '바탕화면에 my-shop이라는 빈 폴더를 하나 만들어요 (영어로 지어야 나중에 GitHub 저장소 이름과 맞추기 쉬워요)', 'AI 도구에서 그 폴더를 열어요'],
        prompt: '이 폴더에 웹사이트를 만들고 싶어요. 코딩은 처음이에요. 앞으로 무엇을 하게 되는지 쉬운 말로 12살 초등학생도 이해할 수 있도록 설명해주세요.',
        stuck: '설치하다가 막혔어요. 지금 화면을 스크린샷 찍어서 붙여넣을게요. 제가 무엇을 누르면 되는지 쉬운 말로 알려주세요.',
      },
      {
        term: 'terminal',
        chapter: '준비하기',
        lead: 'AI가 가끔 "이 명령어를 실행할게요"라고 할 거예요. 그 명령을 입력하는 검은 창이 터미널이에요. 겁먹지 않아도 돼요. 대부분은 AI가 대신 입력하고, 우리는 허락 버튼만 누르면 돼요.',
      },
      {
        term: 'nodejs',
        chapter: '준비하기',
        lead: '웹사이트를 내 컴퓨터에서 돌리려면 Node.js라는 엔진이 필요해요. 직접 설치해도 되지만, AI에게 확인해 달라고 하면 없을 때 대신 설치해 줘요.',
        prompt: '웹사이트를 만드는 데 필요한 Node.js가 제 컴퓨터에 설치돼 있는지 확인해주세요. 없으면 대신 설치해주세요.',
        stuck: '설치하다가 빨간 글씨가 나왔어요. 화면을 스크린샷 찍어서 붙여넣을게요. 무엇이 문제인지 쉬운 말로 알려주세요.',
      },
      {
        term: 'html-css-js',
        chapter: '말로 만들기',
        lead: '드디어 만들 차례예요. 그 전에 하나만 알아둘게요. AI가 만들어 줄 웹페이지는 뼈대(HTML), 옷(CSS), 움직임(JavaScript) 세 가지로 되어 있어요. 직접 쓸 일은 없고, 이름만 알아두면 AI의 설명을 알아들을 수 있어요.',
      },
      {
        term: 'hero-section',
        chapter: '말로 만들기',
        lead: '가게 소개 페이지의 첫 화면부터 만들어볼게요. 들어오자마자 보이는 이 영역을 히어로 섹션이라고 불러요. 아래 문장을 복사해서 내 가게 정보로 바꿔 AI에게 보내보세요. 문장에 들어간 Vite는 Node.js로 돌아가는 웹 개발 도구예요. 이렇게 말해야 다음 단계에서 내 컴퓨터 주소(localhost)로 열어보고, 나중에 Vercel로 인터넷에 공개할 수 있어요.',
        todo: ['가게 이름, 소개 한 줄, 대표 메뉴, 주소를 메모해 둬요', '아래 문장을 복사해서 내 가게 정보로 바꿔 보내요', "마음에 안 드는 곳은 '여기를 이렇게 바꿔줘'라고 다시 말해요"],
        prompt: "제 바탕화면의 my-shop 폴더에 Node.js와 Vite를 사용해서, HTML·CSS·JavaScript로 우리 동네 빵집 '소금빵집' 소개 페이지를 만들어주세요. 맨 위 히어로 섹션에 가게 이름과 한 줄 소개, 그 아래에 대표 메뉴 3개를 사진 카드로, 맨 아래에 주소·영업시간·전화번호를 넣어주세요. 따뜻한 베이지색 느낌으로요.",
        stuck: '설명 중에 모르는 말이 나왔어요: (모르는 단어). 코딩을 전혀 모르는 사람도 알 수 있게 쉬운 비유로 설명해주세요.',
      },
      {
        term: 'localhost-port',
        chapter: '내 컴퓨터에서 열어보기',
        lead: '만든 페이지를 내 컴퓨터에서 열어볼게요. AI가 알려주는 "localhost:"로 시작하는 주소가 바로 내 컴퓨터 안의 주소예요. 나만 볼 수 있는 곳이라 마음껏 고쳐봐도 괜찮아요.',
        walk: [{ text: ['AI에게 방금 만든 소금빵집 소개 페이지를 실행해 달라고 부탁해요.'], shot: 'localhost-my-shop.png' }],
        prompt: '만든 페이지를 제 컴퓨터에서 열어볼 수 있게 실행해주세요. 인터넷 창에 어떤 주소를 넣으면 되는지 알려주세요.',
        stuck: '알려준 주소로 들어갔는데 화면이 하얗게만 나와요. 원인을 찾아서 고쳐주고, 무엇이 문제였는지 쉽게 알려주세요.',
      },
    ],
  },
  {
    title: '왕초보라면 여기부터 2',
    subtitle: 'Git과 GitHub로 안전하게 저장하기',
    prev: '왕초보라면 여기부터 1에서 이어지는 코스예요. 1에서 만든 가게 소개 페이지를 잃어버리지 않게 저장하는 법을 배워요. 아직 1을 하지 않았다면 먼저 1부터 해주세요.',
    road: ['GitHub', '공개범위', '토큰', '연결', '올리기'],
    finish: '이제 내 작업이 GitHub에 안전하게 보관돼요! 마지막 코스에서는 이걸 인터넷에 공개해서 누구나 볼 수 있게 해요.',
    steps: [
      {
        term: 'github-repo',
        chapter: 'GitHub 알기',
        lead: '만든 걸 잃어버리지 않게 보관하는 법을 배울 차례예요. 먼저 아래 설명으로 Git과 GitHub가 무엇인지, 로컬 저장소와 원격 저장소가 무엇인지 알아두세요.',
      },
      {
        term: 'public-private',
        chapter: '공개 범위 알기',
        lead: 'GitHub에 저장소를 만들 때는 누구나 볼 수 있게(Public) 할지, 나만 볼 수 있게(Private) 할지 정해야 해요. 이 튜토리얼에서는 뒤에서 AI에게 Private 저장소를 만들어 달라고 할 거예요. 나중에 언제든 바꿀 수 있어요.',
      },
      {
        term: 'access-token',
        chapter: '개발자 토큰 발급하기',
        lead: 'AI가 내 GitHub에 저장소를 만들고 코드를 올리려면, GitHub가 "정말 주인이 허락했나요?"를 확인할 출입증이 필요해요. 그게 개발자 토큰이에요. 개발자 토큰이 있으면 나 대신에 AI가 GitHub에 접근해서 저장소를 만들고 코드를 업로드할 수 있어요. 아직 가입하지 않았다면 github.com에서 먼저 가입해 주세요.',
        walk: [
          {
            text: [
              'GitHub 오른쪽 위 **내 프로필 사진**을 누르세요. 메뉴 맨 위에 보이는 영어 이름이 **내 계정 이름(사용자 이름)**이에요. 나중에 AI가 터미널로 내 GitHub에 연결할 때 필요하니 복사해 두세요.',
              '메뉴의 **Profile**을 눌러 내 프로필로 들어가면 주소창에 **https://github.com/(계정 이름)**이 보여요. 이게 내 GitHub 주소이고, 슬래시(/) 뒤가 바로 계정 이름이에요. 앞으로 만들 저장소도 https://github.com/(계정 이름)/(저장소 이름) 모양의 주소를 갖게 돼요.',
              '계정 이름을 확인했으면 같은 메뉴 맨 아래 **Settings**를 누르세요.',
            ],
            shot: 'gh-token-1-settings.png',
          },
          { text: ['설정 화면 왼쪽 메뉴를 맨 아래까지 내려서 **Developer settings**를 누르세요.'], shot: 'gh-token-2-developer-settings.png' },
          { text: ['왼쪽에서 **Personal access tokens** → **Fine-grained tokens**를 고르고, 오른쪽 위 **Generate new token**을 누르세요.'], shot: 'gh-token-3-generate.png' },
          { text: ['**Token name**에 알아보기 쉬운 이름을 넣고, **Expiration**(만료일)을 고르세요.', '만료일은 마음대로 정할 수 있어요. 30일로 하면 30일이 지난 뒤 토큰을 새로 만들어야 하고, 반대로 아주 길게 하거나 만료 없음(No expiration)으로 하면 토큰이 새었을 때 오랫동안 악용될 수 있어 위험해요. 처음에는 **30일**을 추천해요.'], shot: 'gh-token-4-name-expiration.png' },
          { text: ['**Repository access**는 **All repositories**를 고르세요. 아직 저장소를 만들기 전이라, 앞으로 AI가 만들 저장소에도 쓸 수 있게 하는 거예요.', '다만 All repositories는 말 그대로 내 **모든 저장소**에 접근할 수 있는 토큰이에요. 더 안전하게 하려면, 저장소를 만든 뒤에 **Only select repositories**로 그 저장소 하나만 고른 토큰을 새로 만들어 쓰는 게 좋아요.'], shot: 'gh-token-5-access.png' },
          {
            text: ['그 아래 **Permissions**에서 **+ Add permissions**를 누르세요. 처음에는 Repositories 0, 아무 권한도 없는 상태예요.'],
            shot: 'gh-token-6-add-permissions.png',
            tip: '권한을 하나도 넣지 않고 만들면 토큰이 있어도 저장소를 만들거나 코드를 올릴 수 없어요.',
          },
          {
            text: [
              '목록에서 **Administration**과 **Contents**를 골라 추가한 뒤, 각 줄 오른쪽 **Access: Read-only**를 눌러 **Read and write**로 바꾸세요. **Metadata**는 자동으로 붙는 기본 권한이라 Read-only 그대로 두면 되고, 마지막으로 맨 아래 초록색 **Generate token**을 누르세요.',
              '**Administration**은 저장소 자체를 관리하는 권한이에요. 저장소를 새로 만들고, 이름이나 공개 범위 같은 설정을 바꾸고, 지울 수도 있어요. 여기서는 AI가 저장소를 새로 만들 때 필요해요. **Contents**는 저장소 안의 파일을 다루는 권한이에요. 코드 파일을 읽고, 새로 올리고(push), 고칠 수 있어요. AI가 내가 만든 코드를 GitHub에 올릴 때 필요해요.',
            ],
            shot: 'gh-token-7-permissions.png',
            tip: 'Administration은 저장소를 지울 수도 있는 강한 권한이에요. 그래서 만료일을 짧게 두고, 토큰을 절대 다른 사람에게 보여주지 마세요.',
          },
          {
            text: ['github_pat_로 시작하는 토큰이 나오면 오른쪽 **복사 버튼**을 눌러 메모장 같은 안전한 곳에 붙여 두세요. **이 화면을 벗어나면 다시 볼 수 없어요.**'],
            shot: 'gh-token-8-copy.png',
            tip: '토큰은 비밀번호와 같아요. 다른 사람에게 보여주거나 스크린샷을 찍지 마세요. 실수로 노출됐다면 같은 화면의 Delete로 지우고 새로 만들면 돼요.',
          },
          { text: ['이제 처음에 복사한 **계정 이름**과 방금 복사한 **토큰**, 이 두 가지를 다음 단계에서 AI에게 연결할 때 써요.'] },
        ],
        stuck: '개발자 토큰을 만드는 화면에서 어디를 눌러야 할지 모르겠어요. 지금 화면을 스크린샷 찍어서 붙여넣을게요. 토큰 값은 가렸어요. 다음에 무엇을 누르면 되는지 알려주세요.',
      },
      {
        term: 'ai-agent',
        chapter: 'AI로 GitHub 저장소 연결하기',
        lead: '이제 직접 GitHub 화면을 돌아다닐 필요 없이, AI 에이전트에게 저장소를 만들고 이 폴더와 연결해 달라고 맡길 거예요. 그 전에 토큰을 안전하게 건네는 방법부터 따라 해 주세요.',
        walk: [
          {
            text: [
              '먼저 복사해 둔 토큰을 **파일로 저장**해요. 메모장(Mac은 텍스트 편집기)을 열어 토큰을 붙여넣고, **바탕화면**에 github-token.txt라는 이름으로 저장하세요.',
              '토큰을 채팅창에 바로 붙여넣으면 대화 기록에 그대로 남아요. 파일에 따로 두고 AI에게는 **파일 위치(경로)만** 알려주면, AI가 그 파일을 열어서 토큰을 쓰고 대화에는 토큰 값이 남지 않아요.',
            ],
            tip: '토큰 파일을 my-shop 폴더 안에 저장하지 마세요. 그 폴더는 GitHub에 올라가는 곳이라, 실수로 토큰까지 함께 올라갈 수 있어요.',
          },
          {
            text: [
              '저장한 파일의 **경로**를 복사해요. Mac은 Finder에서 파일을 한 번 클릭하고 **Option + Command + C**, Windows는 파일을 **Shift + 마우스 오른쪽 클릭 → 경로로 복사**를 누르면 돼요. 복사하면 /Users/(내 이름)/Desktop/github-token.txt 처럼 생긴 글자가 복사돼요.',
            ],
          },
          { text: ['아래 문장의 (계정 이름)과 (파일 경로) 자리에 앞에서 복사한 두 가지를 넣어 AI에게 보내요.'] },
          {
            text: ['AI가 "저장소를 만들고 연결했어요"라고 하면 github.com에서 확인해요. 오른쪽 위 프로필 사진 → **Profile** → 위쪽 **Repositories** 탭을 누르면 **my-shop**이 **Private** 표시와 함께 보여요.'],
            shot: 'gh-repo-1-created.png',
          },
        ],
        prompt: '제 GitHub 계정 이름은 (계정 이름)이에요. 개발자 토큰은 (파일 경로) 파일에 저장해 두었어요. 이 파일에서 토큰을 읽어서, 지금 작업 중인 my-shop 폴더와 같은 이름으로 제 계정에 my-shop이라는 Private 저장소를 만들고 이 폴더와 연결해 주세요. 토큰 값은 채팅이나 코드, 커밋에 절대 남기지 말아 주세요.',
        stuck: '저장소를 연결하다가 오류가 났어요. 지금 화면을 스크린샷 찍어서 붙여넣을게요. 토큰 값은 가렸어요. 무엇이 문제인지 쉬운 말로 알려주세요.',
      },
      {
        term: 'commit-push',
        chapter: '커밋하고 푸시하기',
        lead: '이제 지금까지 만든 걸 GitHub에 올려요. 커밋은 작성한 PPT를 내 컴퓨터(로컬 저장소)에 파일로 저장하는 과정이고, 푸시는 그 파일을 Google Drive 같은 클라우드(원격 저장소)에 업로드하는 거예요. AI에게는 한 문장으로 둘 다 부탁하면 돼요.',
        walk: [
          { text: ['아래의 **👍 AI에게 이렇게 보내보세요**에 적힌 문장을 복사해서 AI에게 커밋하고 푸시해 달라고 해요.'] },
          {
            text: [
              'github.com에서 **my-shop** 저장소를 열어요. 파일 목록 위에 **"첫 화면 완성: 소금빵집 소개 페이지"**라는 커밋 메시지가 보이면 성공이에요. 안 보이면 새로고침해 보세요.',
              '그림 왼쪽 위의 **main**은 브랜치 이름이에요. 브랜치는 저장 기록의 갈래인데, 새 기능을 시험할 때 원본을 건드리지 않으려고 옆으로 갈래를 따로 만들기도 해요. **main**은 그중 기본이 되는 원본 줄기예요. 지금은 갈래를 나눌 필요 없이 main 하나만 쓰면 되고, 다음 코스의 Vercel이 바로 이 main에 올라온 코드를 실제 사이트로 공개해요.',
            ],
            shot: 'gh-repo-2-pushed.png',
          },
          {
            text: [
              '이제 연결은 끝났어요. 앞으로는 AI 에이전트에게 원하는 대로 고쳐 달라고 하고, **커밋과 푸시까지 한 번에** 부탁하면 돼요. 예를 들어 이렇게 보내 보세요.',
              '"영업시간을 오전 8시 ~ 오후 7시로 바꾸고, \'영업시간 변경\'이라는 커밋 메시지로 커밋하고 푸시해 주세요."',
              'GitHub의 my-shop 저장소를 새로고침했을 때 맨 위 커밋 메시지가 **영업시간 변경**으로 바뀌어 있으면, 내가 고친 내용이 잘 올라간 거예요.',
            ],
          },
        ],
        prompt: "지금까지 만든 걸 '첫 화면 완성: 소금빵집 소개 페이지'라는 커밋 메시지로 커밋하고, GitHub의 my-shop 저장소 main 브랜치에 푸시해 주세요. 끝나면 제가 GitHub에서 무엇을 확인하면 되는지 알려주세요.",
        stuck: '푸시했다는데 GitHub 저장소가 비어 있어요. 지금 화면을 스크린샷 찍어서 붙여넣을게요. 무엇이 문제인지 확인해 주세요.',
      },
    ],
  },
  {
    title: '왕초보라면 여기부터 3',
    subtitle: 'Vercel로 인터넷에 공개하기',
    prev: '왕초보라면 여기부터 2에서 이어지는 코스예요. 2에서 GitHub에 올려둔 가게 소개 페이지를 인터넷에 공개해요. 아직 2를 하지 않았다면 먼저 2부터 해주세요.',
    road: ['가입', '연결', '배포'],
    finish: '축하해요! 이제 내 홈페이지가 인터넷에 있어요. 마지막 코스에서는 AI에게 더 정확하게 고쳐 달라고 말하는 데 도움이 되는 도구 두 가지를 배워요.',
    steps: [
      {
        term: 'vercel',
        chapter: 'Vercel 가입하기',
        lead: 'GitHub에 올린 건 아직 "코드 보관함"일 뿐이라 다른 사람이 사이트로 볼 수는 없어요. Vercel은 GitHub에서 코드를 가져와 실제 사이트로 만들고, 인터넷 주소를 붙여 누구나 볼 수 있게 해주는 서비스예요. 개인 사이트는 무료(Hobby)로 쓸 수 있어요.',
        todo: ['아래 버튼으로 Vercel 가입 화면을 열어요', '요금제는 개인용 무료인 **Hobby**를 고르세요', '가입 방법은 **Continue with GitHub**를 눌러, 코스 2에서 만든 GitHub 계정으로 가입하면 다음 단계의 연결이 쉬워져요'],
        links: [['Vercel 가입하러 가기', 'https://vercel.com/signup']],
        stuck: 'Vercel 가입 화면이 영어라서 어디를 눌러야 할지 모르겠어요. 지금 화면을 스크린샷 찍어서 붙여넣을게요. 다음에 무엇을 누르면 되는지 알려주세요.',
      },
      {
        term: 'build',
        chapter: 'GitHub 저장소와 연결하기',
        lead: '이제 Vercel에게 "내 GitHub의 my-shop 저장소를 가져가서 사이트로 만들어 줘"라고 연결해 줄 차례예요. my-shop은 Private(나만 보기) 저장소라서, Vercel이 이 저장소를 볼 수 있게 GitHub에서 한 번 허락해 줘야 해요. 연결이 끝나면 Vercel은 코드를 가져와 사이트용으로 묶는 빌드를 대신 해 줘요.',
        walk: [
          { text: ['Vercel 첫 화면 오른쪽 위 **Create New**를 누르고 **Project**를 고르세요.'], shot: 'vercel/vercel-deploy-1.png' },
          {
            text: ['**Import Git Repository**의 검색창에 my-shop을 검색해 보세요. 처음에는 **No Results Found**가 나올 수 있어요. Vercel이 아직 내 Private 저장소를 볼 권한이 없어서 그래요. 아래 **Configure GitHub App**을 누르세요.'],
            shot: 'vercel/vercel-deploy-2.png',
          },
          { text: ['GitHub 설정 화면에 **Vercel** 앱 페이지가 열려요. Vercel이 내 GitHub 계정에 연결된 앱이라는 뜻이에요. 화면을 아래로 내려 주세요.'], shot: 'vercel/vercel-deploy-3.png' },
          {
            text: ['**Repository access**에서 **Only select repositories**를 고르고, **Select repositories**를 눌러 **my-shop**을 추가한 뒤 **Save**를 누르세요.'],
            shot: 'vercel/vercel-deploy-4.png',
            tip: 'All repositories를 고르면 Vercel이 내 모든 저장소를 볼 수 있어요. 필요한 저장소만 고르는 게 더 안전해요.',
          },
          { text: ['다시 Vercel 화면으로 돌아오면 목록에 자물쇠 표시가 붙은 **my-shop**이 보여요. 옆의 **Import**를 누르세요.'], shot: 'vercel/vercel-deploy-5.png' },
        ],
        stuck: 'Vercel에서 my-shop 저장소가 목록에 안 보여요. 지금 화면을 스크린샷 찍어서 붙여넣을게요. 어떻게 하면 보이게 할 수 있는지 알려주세요.',
      },
      {
        term: 'deploy',
        chapter: '배포하기',
        lead: '드디어 가게 문을 여는 단계예요. Deploy 버튼 하나면 Vercel이 빌드를 마치고 인터넷 주소를 만들어 줘요. 한 번 배포해 두면, 앞으로는 코드를 고쳐서 GitHub의 main에 푸시할 때마다 Vercel이 알아서 다시 배포해 줘요.',
        walk: [
          {
            text: ['**New Project** 화면이 나와요. 맨 위에 **Importing from GitHub**와 my-shop, **main**이 보이면 제대로 연결된 거예요. Project Name은 my-shop 그대로 두고, 나머지 설정도 Vercel이 알아서 채워주니 손대지 말고 맨 아래 **Deploy**를 누르세요.'],
            shot: 'vercel/vercel-deploy-6.png',
          },
          { text: ['계정 보안 설정에 따라 **Verify Your Identity**(본인 확인) 창이 뜰 수 있어요. 이때는 **Use Passkey**를 눌러 본인 확인을 마치면 배포가 이어져요.'], shot: 'vercel/vercel-deploy-7.png' },
          { text: ['**Deployed to Production**이 보이면 배포 성공이에요. **Visit**을 누르면 내 사이트가 열리고, 옆의 복사 버튼을 누르면 주소가 복사돼요.'], shot: 'vercel/vercel-deploy-8.png' },
          { text: ['Vercel 첫 화면의 **Projects**에도 my-shop이 생겼어요. 이름 아래 **…vercel.app** 주소가 내 사이트 주소이고, 그 아래에는 지금 배포된 커밋 메시지가 보여요. 코스 2에서 푸시한 그 커밋이에요.'], shot: 'vercel/vercel-deploy-9.png' },
          { text: ['my-shop을 누르면 프로젝트 화면이 나와요. **Domains**에 보이는 주소가 대표 주소이고, **Status**가 **Ready**면 누구나 들어올 수 있는 상태예요. **Source**의 **main**은 GitHub의 main 브랜치에서 가져와 배포했다는 뜻이에요.'], shot: 'vercel/vercel-deploy-10.png' },
          { text: ['주소로 들어가면 인터넷에 올라간 내 사이트가 보여요. 휴대폰으로도 열어보고, 가족이나 친구에게 카톡으로 보내 보세요.'], shot: 'vercel/vercel-deploy-11.png' },
          { text: ['이제 아래 문장처럼 AI에게 고쳐서 커밋·푸시해 달라고 해 보세요. 잠시 뒤 Vercel이 알아서 다시 배포하고, 내 사이트 주소에서 바뀐 내용을 볼 수 있어요.'] },
        ],
        prompt: "메뉴에 크루아상을 하나 추가하고, '메뉴에 크루아상 추가'라는 커밋 메시지로 커밋해서 GitHub의 my-shop 저장소 main 브랜치에 푸시해 주세요. Vercel에서 다시 배포됐는지 확인하는 방법도 알려주세요.",
        stuck: 'Vercel에서 배포하다가 빨간 Error가 떴어요. 빌드 로그를 복사해서 붙여넣을게요. 원인을 찾아서 고쳐주고 다시 푸시해 주세요.',
      },
    ],
  },
  {
    title: '혼자 마음껏 개발하기',
    subtitle: '개발자 도구로 화면을 살피고 고치기',
    prev: '왕초보라면 여기부터 3에서 이어지는 코스예요. 아직 3을 하지 않았다면 먼저 3부터 해주세요.',
    road: ['개발자 도구', '콘솔'],
    finish: '이제 혼자서도 충분해요! 만들고 싶은 게 생기면 전체 용어에서 이름을 찾아 AI에게 말하고, 이상한 곳은 개발자 도구로 콕 집어 알려주세요.',
    steps: [
      {
        term: 'devtools',
        chapter: '개발자 도구 열기',
        intro: {
          text: "'왕초보라면 여기부터 1~3 시리즈'를 마쳤다면 바이브 코딩의 기초는 이미 갖춘 거예요! 이제부터는 VIBE CODING HANDBOOK의 UI, 디자인, 개발 상식 같은 여러 섹션을 둘러보고, 마음에 드는 걸 직접 만들어 보며 배우는 즐거운 과정이 남아 있어요. 이번 코스에서는 그 과정을 더 잘하기 위한 팁 2가지를 알려드릴게요.",
          shot: 'vibe-coding-handbook.png',
        },
        lead: '"이 부분을 고쳐줘"라고 말해도 AI가 어디를 말하는지 못 알아들을 때가 있어요. 이럴 때 개발자 도구를 쓰면 화면의 특정 부분을 콕 집어 AI에게 보여줄 수 있어요. 크롬 같은 브라우저에 이미 들어 있어서 따로 설치할 필요가 없고, 아래 안내를 따라 내 사이트에서 한 번씩 열어보면 돼요.',
      },
      {
        term: 'console-error',
        chapter: '에러 확인하기',
        lead: '화면이 이상하거나 하얗게 나와도 당황하지 마세요. 원인은 대부분 개발자 도구의 콘솔(Console) 탭에 빨간 글씨로 적혀 있어요. 그 글씨를 그대로 복사해 AI에게 보내면 가장 빨리 고칠 수 있어요.',
      },
    ],
  },
]

// public/tutorial/ 에 실제로 넣어둔 스크린샷만 화면에 보여준다
export const SHOTS = new Set([
  'vercel/vercel-deploy-1.png',
  'vercel/vercel-deploy-2.png',
  'vercel/vercel-deploy-3.png',
  'vercel/vercel-deploy-4.png',
  'vercel/vercel-deploy-5.png',
  'vercel/vercel-deploy-6.png',
  'vercel/vercel-deploy-7.png',
  'vercel/vercel-deploy-8.png',
  'vercel/vercel-deploy-9.png',
  'vercel/vercel-deploy-10.png',
  'vercel/vercel-deploy-11.png',
  'localhost-my-shop.png',
  'vibe-coding-handbook.png',
  'gh-token-1-settings.png',
  'gh-token-2-developer-settings.png',
  'gh-token-3-generate.png',
  'gh-token-4-name-expiration.png',
  'gh-token-5-access.png',
  'gh-token-6-add-permissions.png',
  'gh-token-7-permissions.png',
  'gh-token-8-copy.png',
  'gh-repo-1-created.png',
  'gh-repo-2-pushed.png',
])
