'use strict';
/* i18n.js - 16-language interface pack for C Drive Cleaner neo.
   Fallback chain: current language -> zh-CN -> key itself. */

const LANG_NAMES = {
  'zh-CN': '简体中文', 'zh-TW': '繁體中文', 'en': 'English', 'ja': '日本語',
  'ko': '한국어', 'fr': 'Français', 'de': 'Deutsch', 'es': 'Español',
  'ru': 'Русский', 'pt': 'Português', 'it': 'Italiano', 'ar': 'العربية',
  'hi': 'हिन्दी', 'th': 'ไทย', 'vi': 'Tiếng Việt', 'id': 'Bahasa Indonesia',
};

const I18N = {
'zh-CN': {
'large.colsize':'大小','large.colpath':'文件路径',
'st.admin.got':'已获取','st.admin.none':'未获取（清理可能不完整）','st.admin.na':'不适用（模拟模式）',
'nav.home':'主页','nav.quick':'快速清理','nav.adv':'高级清理','nav.disk':'磁盘空间','nav.large':'大文件查找','nav.settings':'日志与设置','nav.about':'关于',
'home.title':'主页','home.hero.badge':'基于旧版打造的全新 neo 架构','home.hero.h2':'让 C 盘空间回到最佳状态','home.hero.p':'轻量、完全离线。基于旧版打造的全新 neo 架构，原生高速引擎。',
'home.btn.quick':'一键快速清理','home.btn.adv':'自定义高级清理','home.admin':'管理员权限','home.log':'全局日志','home.cfree':'C 盘剩余（启动自动检测）',
'home.mode':'运行模式','home.mode.win':'Windows 模式：图形界面将驱动内置的清理引擎执行真实清理，全部功能开箱即用。','home.mode.sim':'当前在非 Windows 环境运行，所有任务以"模拟模式"演示界面流程，不会执行任何真实清理。在 Windows 上将执行真实清理命令。',
'home.features':'全部功能','home.tempwarn':'检测到程序正从临时目录运行：清理临时文件时，本程序占用的文件无法被删除（属正常保护）。建议将 EXE 移动到固定位置（如桌面或 D 盘）后再运行，以获得最完整的清理效果。',
'fq.n':'一键快速清理','fq.d':'自动清理 9 类常见垃圾，一键完成','fa.n':'高级自定义模式','fa.d':'逐项选择 11 个清理项，危险项红色警示','fd.n':'磁盘空间查看','fd.d':'输入盘符查看总容量 / 已用 / 剩余','fl.n':'大文件查找','fl.d':'原生高速引擎多线程扫描，定位大体积文件',
'quick.title':'快速清理','quick.sub':'按固定顺序执行以下 9 项清理，全程自动。','quick.card':'一键快速清理',
'common.start':'开始','common.cancel':'取消','common.ready':'就绪','common.running':'正在执行…','common.done':'已完成','term.title':'执行输出',
'adv.title':'高级清理','adv.sub':'逐项选择要清理的内容。','adv.safe':'常规项目（安全）','adv.danger':'危险操作区（可能影响系统恢复，请谨慎）','adv.exec':'执行','adv.selected':'已选择',
'disk.title':'磁盘空间','disk.sub':'输入盘符查看总容量、已用空间和剩余空间。','disk.query':'查询','disk.err':'无效盘符。请输入 A 到 Z 的单个字母。','disk.total':'总容量 Total','disk.used':'已用 Used','disk.free':'剩余 Free','disk.pct':'已使用 {p}%',
'large.title':'大文件查找','large.sub':'高速多线程扫描 C 盘，最多显示前 20 个结果。','large.label':'最小文件大小 (GB)','large.scan':'开始扫描','large.err':'无效输入。请输入数字（仅允许 0-9 与小数点），例如 1、2.5 或 0.5。','large.hint':'输入 0 将扫描所有文件（较慢）。扫描期间可随时取消。','large.result':'扫描结果','large.count':'{n} 个文件','large.scanning':'正在高速扫描…','large.detail':'已扫描 {s} 个文件 · 匹配 {m} 个',
'set.title':'日志与设置','set.sub':'Logging & Settings','set.log.name':'全局日志','set.log.desc':'开启后所有清理操作将记录到 C:\\Log\\CleanLog.txt（占用空间极小）。','set.lang.name':'界面语言','set.lang.desc':'支持 16 种语言，切换后立即生效。',
'log.refresh':'刷新','log.open':'打开日志目录','log.clean':'清理日志 CleanLog','log.app':'应用运行日志','log.export':'导出应用日志','log.none':'（尚未生成清理日志）',
'about.title':'关于','about.impl':'实现说明','about.note1':'清理命令逐字节取自原版脚本，未做任何修改；','about.note2':'大文件查找采用 neo 原生高速引擎，多线程并发扫描；','about.note3':'危险操作（删除全部还原点、补丁缓存清理）保留醒目警告；','about.note4':'如需原版体验，可点击下方按钮启动控制台版本。','about.bat':'原版脚本','about.plat':'运行平台','about.repo':'原版仓库','about.ver':'版本','about.console':'启动原版控制台 (bat)',
'toast.busy':'已有任务正在运行','toast.empty':'请至少选择一个清理项','toast.consim':'模拟模式：请在 Windows 上运行以启动控制台版本','toast.conok':'已启动原版控制台','toast.logon':'全局日志已开启','toast.logoff':'全局日志已关闭','task.end':'任务结束 (退出代码: {c})','checking':'检测中…','fail':'检测失败','hero.free':'C 盘剩余','adv.items':'项'
},
'zh-TW': {
'large.colsize':'大小','large.colpath':'檔案路徑',
'st.admin.got':'已獲取','st.admin.none':'未獲取（清理可能不完整）','st.admin.na':'不適用（模擬模式）',
'nav.home':'主頁','nav.quick':'快速清理','nav.adv':'進階清理','nav.disk':'磁碟空間','nav.large':'大檔案尋找','nav.settings':'記錄與設定','nav.about':'關於',
'home.title':'主頁','home.hero.badge':'基於舊版打造的全新 neo 架構','home.hero.h2':'讓 C 磁碟空間回到最佳狀態','home.hero.p':'輕量、完全離線。基於舊版打造的全新 neo 架構，原生高速引擎。',
'home.btn.quick':'一鍵快速清理','home.btn.adv':'自訂進階清理','home.admin':'管理員權限','home.log':'全域記錄','home.cfree':'C 磁碟剩餘（啟動自動偵測）',
'home.mode':'執行模式','home.mode.win':'Windows 模式：圖形介面將驅動內建的清理引擎執行真實清理，全部功能開箱即用。','home.mode.sim':'目前在非 Windows 環境執行，所有工作以「模擬模式」演示介面流程，不會執行任何真實清理。在 Windows 上將執行真實清理命令。',
'home.features':'全部功能','home.tempwarn':'偵測到程式正從暫存目錄執行：清理暫存檔案時，本程式佔用的檔案無法被刪除（屬正常保護）。建議將 EXE 移動到固定位置（如桌面或 D 磁碟）後再執行，以獲得最完整的清理效果。',
'fq.n':'一鍵快速清理','fq.d':'自動清理 9 類常見垃圾，一鍵完成','fa.n':'進階自訂模式','fa.d':'逐項選擇 11 個清理項，危險項紅色警示','fd.n':'磁碟空間檢視','fd.d':'輸入磁碟機代號檢視總容量 / 已用 / 剩餘','fl.n':'大檔案尋找','fl.d':'原生高速引擎多執行緒掃描，定位大體積檔案',
'quick.title':'快速清理','quick.sub':'按固定順序執行以下 9 項清理，全程自動。','quick.card':'一鍵快速清理',
'common.start':'開始','common.cancel':'取消','common.ready':'就緒','common.running':'正在執行…','common.done':'已完成','term.title':'執行輸出',
'adv.title':'進階清理','adv.sub':'逐項選擇要清理的內容。','adv.safe':'常規項目（安全）','adv.danger':'危險操作區（可能影響系統還原，請謹慎）','adv.exec':'執行','adv.selected':'已選擇',
'disk.title':'磁碟空間','disk.sub':'輸入磁碟機代號檢視總容量、已用空間和剩餘空間。','disk.query':'查詢','disk.err':'無效磁碟機代號。請輸入 A 到 Z 的單一字元。','disk.total':'總容量 Total','disk.used':'已用 Used','disk.free':'剩餘 Free','disk.pct':'已使用 {p}%',
'large.title':'大檔案尋找','large.sub':'高速多執行緒掃描 C 磁碟，最多顯示前 20 個結果。','large.label':'最小檔案大小 (GB)','large.scan':'開始掃描','large.err':'無效輸入。請輸入數字（僅允許 0-9 與小數點），例如 1、2.5 或 0.5。','large.hint':'輸入 0 將掃描所有檔案（較慢）。掃描期間可隨時取消。','large.result':'掃描結果','large.count':'{n} 個檔案','large.scanning':'正在高速掃描…','large.detail':'已掃描 {s} 個檔案 · 匹配 {m} 個',
'set.title':'記錄與設定','set.sub':'Logging & Settings','set.log.name':'全域記錄','set.log.desc':'開啟後所有清理操作將記錄到 C:\\Log\\CleanLog.txt（佔用空間極小）。','set.lang.name':'介面語言','set.lang.desc':'支援 16 種語言，切換後立即生效。',
'log.refresh':'重新整理','log.open':'開啟記錄目錄','log.clean':'清理記錄 CleanLog','log.app':'應用執行記錄','log.export':'匯出應用記錄','log.none':'（尚未產生清理記錄）',
'about.title':'關於','about.impl':'實作說明','about.note1':'清理命令逐位元組取自原版腳本，未做任何修改；','about.note2':'大檔案尋找採用 neo 原生高速引擎，多執行緒並行掃描；','about.note3':'危險操作（刪除所有還原點、修補快取清理）保留醒目警告；','about.note4':'如需原版體驗，可點選下方按鈕啟動主控台版本。','about.bat':'原版腳本','about.plat':'執行平台','about.repo':'原版倉庫','about.ver':'版本','about.console':'啟動原版主控台 (bat)',
'toast.busy':'已有工作正在執行','toast.empty':'請至少選擇一個清理項','toast.consim':'模擬模式：請在 Windows 上執行以啟動主控台版本','toast.conok':'已啟動原版主控台','toast.logon':'全域記錄已開啟','toast.logoff':'全域記錄已關閉','task.end':'工作結束（結束代碼: {c}）','checking':'偵測中…','fail':'偵測失敗','hero.free':'C 磁碟剩餘','adv.items':'項'
},
'en': {
'large.colsize':'Size','large.colpath':'File path',
'st.admin.got':'Obtained','st.admin.none':'Not obtained (cleaning may be incomplete)','st.admin.na':'N/A (simulation mode)',
'nav.home':'Home','nav.quick':'Quick Clean','nav.adv':'Advanced Clean','nav.disk':'Disk Usage','nav.large':'Large Files','nav.settings':'Logs & Settings','nav.about':'About',
'home.title':'Home','home.hero.badge':'The all-new neo architecture built on the legacy edition','home.hero.h2':'Bring your C drive back to its best','home.hero.p':'Lightweight, fully offline. The all-new neo architecture built on the legacy edition, with a native high-speed engine.',
'home.btn.quick':'One-click Quick Clean','home.btn.adv':'Custom Advanced Clean','home.admin':'Administrator rights','home.log':'Global logging','home.cfree':'C drive free (auto-detected at startup)',
'home.mode':'Run mode','home.mode.win':'Windows mode: the GUI drives the built-in cleaning engine to perform real cleaning. Everything works out of the box.','home.mode.sim':'Running in a non-Windows environment: all tasks demo the UI flow in simulation mode and perform no real cleaning. On Windows the real cleaning commands are executed.',
'home.features':'All features','home.tempwarn':'The app is running from a temporary directory: files in use by this app cannot be deleted during temp cleaning (normal protection). Move the EXE to a fixed location (e.g. Desktop or D:) for the best cleaning results.',
'fq.n':'One-click Quick Clean','fq.d':'Automatically cleans 9 common junk categories','fa.n':'Advanced Custom Mode','fa.d':'Choose from 11 cleaning items, danger zone highlighted in red','fd.n':'Disk Usage Viewer','fd.d':'Enter a drive letter to view total / used / free','fl.n':'Large File Finder','fl.d':'Native high-speed multi-threaded scan to locate large files',
'quick.title':'Quick Clean','quick.sub':'Runs the following 9 items in fixed order, fully automatic.','quick.card':'One-click Quick Clean',
'common.start':'Start','common.cancel':'Cancel','common.ready':'Ready','common.running':'Running…','common.done':'Completed','term.title':'Output',
'adv.title':'Advanced Clean','adv.sub':'Select items to clean one by one.','adv.safe':'Standard items (safe)','adv.danger':'Danger zone (may affect system recovery — use with caution)','adv.exec':'Execute','adv.selected':'Selected',
'disk.title':'Disk Usage','disk.sub':'Enter a drive letter to view total, used and free space.','disk.query':'Query','disk.err':'Invalid drive letter. Enter a single letter from A to Z.','disk.total':'Total','disk.used':'Used','disk.free':'Free','disk.pct':'{p}% used',
'large.title':'Large Files','large.sub':'Fast multi-threaded scan of C:, showing the top 20 results.','large.label':'Minimum file size (GB)','large.scan':'Start scan','large.err':'Invalid input. Enter a number (digits and dot only), e.g. 1, 2.5 or 0.5.','large.hint':'Enter 0 to scan all files (slow). You can cancel at any time.','large.result':'Results','large.count':'{n} files','large.scanning':'High-speed scanning…','large.detail':'{s} files scanned · {m} matched',
'set.title':'Logs & Settings','set.sub':'Logging & Settings','set.log.name':'Global logging','set.log.desc':'When enabled, all cleaning operations are recorded to C:\\Log\\CleanLog.txt (uses very little space).','set.lang.name':'Interface language','set.lang.desc':'16 languages supported. Changes apply instantly.',
'log.refresh':'Refresh','log.open':'Open log folder','log.clean':'Clean log (CleanLog)','log.app':'Application log','log.export':'Export app log','log.none':'(No clean log generated yet)',
'about.title':'About','about.impl':'Implementation notes','about.note1':'Cleaning commands are taken byte-for-byte from the original script, unmodified;','about.note2':'Large file search uses the neo native high-speed engine with multi-threaded scanning;','about.note3':'Dangerous operations (deleting all restore points, patch cache cleaning) keep prominent warnings;','about.note4':'For the original experience, click the button below to launch the console version.','about.bat':'Original script','about.plat':'Platform','about.repo':'Original repository','about.ver':'Version','about.console':'Launch original console (bat)',
'toast.busy':'A task is already running','toast.empty':'Select at least one cleaning item','toast.consim':'Simulation mode: run on Windows to launch the console version','toast.conok':'Original console launched','toast.logon':'Global logging enabled','toast.logoff':'Global logging disabled','task.end':'Task ended (exit code: {c})','checking':'Checking…','fail':'Check failed','hero.free':'C drive free','adv.items':'items'
},
'ja': {
'large.colsize':'サイズ','large.colpath':'ファイルパス',
'st.admin.got':'取得済み','st.admin.none':'未取得（クリーニングが不完全になる可能性）','st.admin.na':'該当なし（シミュレーション）',
'nav.home':'ホーム','nav.quick':'クイッククリーン','nav.adv':'詳細クリーン','nav.disk':'ディスク使用量','nav.large':'大きなファイル','nav.settings':'ログと設定','nav.about':'情報',
'home.title':'ホーム','home.hero.badge':'旧版を基に構築した新 neo アーキテクチャ','home.hero.h2':'C ドライブを最佳な状態へ','home.hero.p':'軽量・完全オフライン。旧版を基に構築した新 neo アーキテクチャ、ネイティブ高速エンジン搭載。',
'home.btn.quick':'ワンクリック クイッククリーン','home.btn.adv':'カスタム詳細クリーン','home.admin':'管理者権限','home.log':'グローバルログ','home.cfree':'C ドライブ空き（起動時に自動検出）',
'home.mode':'実行モード','home.mode.win':'Windows モード：GUI が内蔵のクリーニングエンジンを駆動して実際にクリーニングします。すべての機能がすぐに使えます。','home.mode.sim':'現在は非 Windows 環境のため、すべてのタスクはシミュレーションモードで画面フローを演示します。Windows では実際のクリーニングコマンドが実行されます。',
'home.features':'すべての機能','home.tempwarn':'プログラムは一時ディレクトリから実行されています：一時ファイルのクリーニング中、本プログラムが使用中のファイルは削除できません（正常な保護）。EXE を固定の場所（デスクトップや D ドライブなど）へ移動して実行することをお勧めします。',
'fq.n':'ワンクリック クイッククリーン','fq.d':'9 種類の不要ファイルを自動クリーン','fa.n':'詳細カスタムモード','fa.d':'11 項目から選択、危険項目は赤色で警告','fd.n':'ディスク使用量ビューア','fd.d':'ドライブ文字を入力して容量/使用量/空きを確認','fl.n':'大きなファイル検索','fl.d':'ネイティブ高速エンジンのマルチスレッドスキャンで大容量ファイルを特定',
'quick.title':'クイッククリーン','quick.sub':'固定の順序で以下の 9 項目を自動実行します。','quick.card':'ワンクリック クイッククリーン',
'common.start':'開始','common.cancel':'キャンセル','common.ready':'準備完了','common.running':'実行中…','common.done':'完了','term.title':'実行出力',
'adv.title':'詳細クリーン','adv.sub':'クリーンする項目を個別に選択します。','adv.safe':'通常項目（安全）','adv.danger':'危険操作エリア（システムの復元に影響する可能性、注意）','adv.exec':'実行','adv.selected':'選択済み',
'disk.title':'ディスク使用量','disk.sub':'ドライブ文字を入力して総容量・使用量・空き容量を確認します。','disk.query':'検索','disk.err':'無効なドライブ文字。A〜Z の 1 文字を入力してください。','disk.total':'総容量 Total','disk.used':'使用 Used','disk.free':'空き Free','disk.pct':'使用率 {p}%',
'large.title':'大きなファイル','large.sub':'高速マルチスレッドで C ドライブをスキャンし、上位 20 件を表示します。','large.label':'最小ファイルサイズ (GB)','large.scan':'スキャン開始','large.err':'無効な入力。数値を入力してください（0-9 と小数点のみ）、例：1、2.5、0.5。','large.hint':'0 を入力すると全ファイルをスキャン（低速）。スキャン中はいつでもキャンセル可能。','large.result':'スキャン結果','large.count':'{n} 件','large.scanning':'高速スキャン中…','large.detail':'{s} ファイルをスキャン済み · {m} 件一致',
'set.title':'ログと設定','set.sub':'Logging & Settings','set.log.name':'グローバルログ','set.log.desc':'有効にすると、すべてのクリーニング操作が C:\\Log\\CleanLog.txt に記録されます（容量はごくわずか）。','set.lang.name':'表示言語','set.lang.desc':'16 言語に対応、切り替えは即時反映。',
'log.refresh':'更新','log.open':'ログフォルダを開く','log.clean':'クリーンログ CleanLog','log.app':'アプリ実行ログ','log.export':'アプリログをエクスポート','log.none':'（クリーンログはまだ生成されていません）',
'about.title':'情報','about.impl':'実装の説明','about.note1':'クリーニングコマンドはオリジナルスクリプトからバイト単位でそのまま取得、一切変更なし；','about.note2':'大きなファイル検索は neo ネイティブ高速エンジンによるマルチスレッドスキャンを使用；','about.note3':'危険操作（全復元ポイントの削除、パッチキャッシュのクリーン）は目立つ警告を保持；','about.note4':'オリジナル体験が必要な場合は、下のボタンからコンソール版を起動できます。','about.bat':'オリジナルスクリプト','about.plat':'実行プラットフォーム','about.repo':'オリジナルリポジトリ','about.ver':'バージョン','about.console':'オリジナルコンソールを起動 (bat)',
'toast.busy':'タスクは既に実行中です','toast.empty':'少なくとも 1 項目選択してください','toast.consim':'シミュレーションモード：コンソール版は Windows で起動してください','toast.conok':'オリジナルコンソールを起動しました','toast.logon':'グローバルログを有効にしました','toast.logoff':'グローバルログを無効にしました','task.end':'タスク終了（終了コード: {c}）','checking':'検出中…','fail':'検出失敗','hero.free':'C ドライブ空き','adv.items':'項目'
},
'ko': {
'large.colsize':'크기','large.colpath':'파일 경로',
'st.admin.got':'획득됨','st.admin.none':'미획득(정리가 불완전할 수 있음)','st.admin.na':'해당 없음(시뮬레이션)',
'nav.home':'홈','nav.quick':'빠른 정리','nav.adv':'고급 정리','nav.disk':'디스크 사용량','nav.large':'큰 파일 찾기','nav.settings':'로그 및 설정','nav.about':'정보',
'home.title':'홈','home.hero.badge':'구버전을 기반으로 한 새로운 neo 아키텍처','home.hero.h2':'C 드라이브를 최적 상태로','home.hero.p':'가볍고 완전 오프라인. 구버전을 기반으로 한 새로운 neo 아키텍처, 네이티브 고속 엔진 탑재.',
'home.btn.quick':'원클릭 빠른 정리','home.btn.adv':'사용자 정의 고급 정리','home.admin':'관리자 권한','home.log':'전역 로그','home.cfree':'C 드라이브 여유 (시작 시 자동 감지)',
'home.mode':'실행 모드','home.mode.win':'Windows 모드: GUI가 내장된 정리 엔진을 구동하여 실제 정리를 수행합니다. 모든 기능을 바로 사용할 수 있습니다.','home.mode.sim':'현재 비 Windows 환경에서 실행 중입니다. 모든 작업은 시뮬레이션 모드로 화면 흐름만 시연합니다. Windows에서는 실제 정리 명령이 실행됩니다.',
'home.features':'모든 기능','home.tempwarn':'프로그램이 임시 디렉터리에서 실행 중입니다: 임시 파일 정리 시 본 프로그램이 사용 중인 파일은 삭제할 수 없습니다(정상적인 보호). EXE를 고정된 위치(바탕 화면이나 D 드라이브 등)로 옮겨 실행하는 것을 권장합니다.',
'fq.n':'원클릭 빠른 정리','fq.d':'9가지 일반 정크를 자동으로 정리','fa.n':'고급 사용자 정의 모드','fa.d':'11개 항목 중 선택, 위험 항목은 빨간색 경고','fd.n':'디스크 사용량 보기','fd.d':'드라이브 문자를 입력하여 총 용량/사용/여유 확인','fl.n':'큰 파일 찾기','fl.d':'네이티브 고속 엔진 멀티스레드 스캔으로 대용량 파일 위치 확인',
'quick.title':'빠른 정리','quick.sub':'고정된 순서로 아래 9개 항목을 자동 실행합니다.','quick.card':'원클릭 빠른 정리',
'common.start':'시작','common.cancel':'취소','common.ready':'대기 중','common.running':'실행 중…','common.done':'완료','term.title':'실행 출력',
'adv.title':'고급 정리','adv.sub':'정리할 항목을 하나씩 선택합니다.','adv.safe':'일반 항목(안전)','adv.danger':'위험 작업 영역(시스템 복원에 영향을 줄 수 있음, 주의)','adv.exec':'실행','adv.selected':'선택됨',
'disk.title':'디스크 사용량','disk.sub':'드라이브 문자를 입력하여 총 용량, 사용량, 여유 공간을 확인합니다.','disk.query':'조회','disk.err':'잘못된 드라이브 문자입니다. A에서 Z 사이의 한 글자를 입력하세요.','disk.total':'총 용량 Total','disk.used':'사용 Used','disk.free':'여유 Free','disk.pct':'{p}% 사용됨',
'large.title':'큰 파일','large.sub':'고속 멀티스레드로 C 드라이브를 스캔하여 상위 20개 결과를 표시합니다.','large.label':'최소 파일 크기 (GB)','large.scan':'스캔 시작','large.err':'잘못된 입력입니다. 숫자를 입력하세요(0-9와 소수점만 허용), 예: 1, 2.5, 0.5.','large.hint':'0을 입력하면 모든 파일을 스캔합니다(느림). 스캔 중 언제든 취소할 수 있습니다.','large.result':'스캔 결과','large.count':'{n}개 파일','large.scanning':'고속 스캔 중…','large.detail':'{s}개 파일 스캔 완료 · {m}개 일치',
'set.title':'로그 및 설정','set.sub':'Logging & Settings','set.log.name':'전역 로그','set.log.desc':'활성화하면 모든 정리 작업이 C:\\Log\\CleanLog.txt에 기록됩니다(공간 차지 극소).','set.lang.name':'인터페이스 언어','set.lang.desc':'16개 언어 지원, 전환 즉시 적용.',
'log.refresh':'새로 고침','log.open':'로그 폴더 열기','log.clean':'정리 로그 CleanLog','log.app':'앱 실행 로그','log.export':'앱 로그 내보내기','log.none':'(아직 정리 로그가 생성되지 않았습니다)',
'about.title':'정보','about.impl':'구현 설명','about.note1':'정리 명령은 오리지널 스크립트에서 바이트 단위 그대로 가져왔으며 어떠한 수정도 없습니다;','about.note2':'큰 파일 찾기는 neo 네이티브 고속 엔진의 멀티스레드 스캔을 사용합니다;','about.note3':'위험 작업(모든 복원 지점 삭제, 패치 캐시 정리)은 눈에 띄는 경고를 유지합니다;','about.note4':'원본 경험이 필요하면 아래 버튼으로 콘솔 버전을 실행할 수 있습니다.','about.bat':'원본 스크립트','about.plat':'실행 플랫폼','about.repo':'원본 저장소','about.ver':'버전','about.console':'원본 콘솔 실행 (bat)',
'toast.busy':'이미 실행 중인 작업이 있습니다','toast.empty':'최소 하나의 정리 항목을 선택하세요','toast.consim':'시뮬레이션 모드: 콘솔 버전은 Windows에서 실행하세요','toast.conok':'원본 콘솔을 실행했습니다','toast.logon':'전역 로그가 활성화되었습니다','toast.logoff':'전역 로그가 비활성화되었습니다','task.end':'작업 종료 (종료 코드: {c})','checking':'감지 중…','fail':'감지 실패','hero.free':'C 드라이브 여유','adv.items':'항목'
},
'fr': {
'large.colsize':'Taille','large.colpath':'Chemin du fichier',
'st.admin.got':'Obtenus','st.admin.none':'Non obtenus (nettoyage possiblement incomplet)','st.admin.na':'N/D (mode simulation)',
'nav.home':'Accueil','nav.quick':'Nettoyage rapide','nav.adv':'Nettoyage avancé','nav.disk':'Espace disque','nav.large':'Grands fichiers','nav.settings':'Journaux et paramètres','nav.about':'À propos',
'home.title':'Accueil','home.hero.badge':'La nouvelle architecture neo bâtie sur l\'édition d\'origine','home.hero.h2':'Redonnez à votre disque C son meilleur état','home.hero.p':'Léger, 100 % hors ligne. La nouvelle architecture neo bâtie sur l\'édition d\'origine, avec un moteur natif haute vitesse.',
'home.btn.quick':'Nettoyage rapide en un clic','home.btn.adv':'Nettoyage avancé personnalisé','home.admin':'Droits administrateur','home.log':'Journal global','home.cfree':'Espace libre C: (détection auto au démarrage)',
'home.mode':'Mode d\'exécution','home.mode.win':'Mode Windows : l\'interface pilote le moteur de nettoyage intégré pour un nettoyage réel. Tout fonctionne immédiatement.','home.mode.sim':'Environnement non Windows : toutes les tâches affichent le déroulement en mode simulation, sans nettoyage réel. Sous Windows, les commandes de nettoyage réelles sont exécutées.',
'home.features':'Toutes les fonctions','home.tempwarn':'Le programme s\'exécute depuis un dossier temporaire : lors du nettoyage des fichiers temporaires, les fichiers utilisés par ce programme ne peuvent pas être supprimés (protection normale). Déplacez l\'EXE vers un emplacement fixe (Bureau ou D:) pour un nettoyage complet.',
'fq.n':'Nettoyage rapide en un clic','fq.d':'Nettoie automatiquement 9 catégories de fichiers inutiles','fa.n':'Mode avancé personnalisé','fa.d':'Choisissez parmi 11 éléments, zone dangereuse en rouge','fd.n':'Espace disque','fd.d':'Entrez une lettre de lecteur pour voir total / utilisé / libre','fl.n':'Recherche de grands fichiers','fl.d':'Analyse multithread native haute vitesse pour localiser les gros fichiers',
'quick.title':'Nettoyage rapide','quick.sub':'Exécute les 9 éléments suivants dans un ordre fixe, entièrement automatique.','quick.card':'Nettoyage rapide en un clic',
'common.start':'Démarrer','common.cancel':'Annuler','common.ready':'Prêt','common.running':'En cours…','common.done':'Terminé','term.title':'Sortie',
'adv.title':'Nettoyage avancé','adv.sub':'Sélectionnez les éléments à nettoyer un par un.','adv.safe':'Éléments standard (sûrs)','adv.danger':'Zone dangereuse (peut affecter la récupération système — prudence)','adv.exec':'Exécuter','adv.selected':'Sélectionnés',
'disk.title':'Espace disque','disk.sub':'Entrez une lettre de lecteur pour voir l\'espace total, utilisé et libre.','disk.query':'Consulter','disk.err':'Lettre de lecteur invalide. Entrez une seule lettre de A à Z.','disk.total':'Total','disk.used':'Utilisé','disk.free':'Libre','disk.pct':'{p} % utilisé',
'large.title':'Grands fichiers','large.sub':'Analyse multithread rapide du disque C:, affichant les 20 premiers résultats.','large.label':'Taille minimale (Go)','large.scan':'Lancer l\'analyse','large.err':'Entrée invalide. Entrez un nombre (chiffres et point uniquement), ex. 1, 2.5 ou 0.5.','large.hint':'0 analyse tous les fichiers (lent). Annulation possible à tout moment.','large.result':'Résultats','large.count':'{n} fichiers','large.scanning':'Analyse haute vitesse…','large.detail':'{s} fichiers analysés · {m} correspondants',
'set.title':'Journaux et paramètres','set.sub':'Logging & Settings','set.log.name':'Journal global','set.log.desc':'Une fois activé, toutes les opérations sont consignées dans C:\\Log\\CleanLog.txt (très peu d\'espace).','set.lang.name':'Langue de l\'interface','set.lang.desc':'16 langues prises en charge, effet immédiat.',
'log.refresh':'Actualiser','log.open':'Ouvrir le dossier des journaux','log.clean':'Journal de nettoyage CleanLog','log.app':'Journal de l\'application','log.export':'Exporter le journal','log.none':'(Aucun journal de nettoyage généré)',
'about.title':'À propos','about.impl':'Notes d\'implémentation','about.note1':'Les commandes de nettoyage proviennent du script original, octet par octet, sans modification ;','about.note2':'La recherche de grands fichiers utilise le moteur natif neo haute vitesse avec analyse multithread ;','about.note3':'Les opérations dangereuses (suppression de tous les points de restauration, cache de correctifs) conservent des avertissements visibles ;','about.note4':'Pour l\'expérience d\'origine, cliquez ci-dessous pour lancer la version console.','about.bat':'Script original','about.plat':'Plateforme','about.repo':'Dépôt original','about.ver':'Version','about.console':'Lancer la console originale (bat)',
'toast.busy':'Une tâche est déjà en cours','toast.empty':'Sélectionnez au moins un élément','toast.consim':'Mode simulation : exécutez sous Windows pour lancer la console','toast.conok':'Console originale lancée','toast.logon':'Journal global activé','toast.logoff':'Journal global désactivé','task.end':'Tâche terminée (code : {c})','checking':'Vérification…','fail':'Échec de vérification','hero.free':'Espace libre C:','adv.items':'éléments'
},
'de': {
'large.colsize':'Größe','large.colpath':'Dateipfad',
'st.admin.got':'Vorhanden','st.admin.none':'Nicht vorhanden (Reinigung evtl. unvollständig)','st.admin.na':'N/V (Simulationsmodus)',
'nav.home':'Start','nav.quick':'Schnellreinigung','nav.adv':'Erweiterte Reinigung','nav.disk':'Speicherplatz','nav.large':'Große Dateien','nav.settings':'Protokolle & Einstellungen','nav.about':'Über',
'home.title':'Start','home.hero.badge':'Die neue neo-Architektur auf Basis der Originalversion','home.hero.h2':'Bringen Sie Laufwerk C wieder in Bestform','home.hero.p':'Leicht, vollständig offline. Die neue neo-Architektur auf Basis der Originalversion, mit nativer Hochgeschwindigkeits-Engine.',
'home.btn.quick':'Schnellreinigung per Klick','home.btn.adv':'Benutzerdefinierte erweiterte Reinigung','home.admin':'Administratorrechte','home.log':'Globale Protokollierung','home.cfree':'Freier Speicher C: (automatisch beim Start)',
'home.mode':'Betriebsmodus','home.mode.win':'Windows-Modus: Die Oberfläche führt die integrierte Reinigungs-Engine für eine echte Reinigung aus. Alle Funktionen sind sofort einsatzbereit.','home.mode.sim':'Aktuell in einer Nicht-Windows-Umgebung: Alle Aufgaben demonstrieren den Ablauf im Simulationsmodus ohne echte Reinigung. Unter Windows werden die echten Reinigungsbefehle ausgeführt.',
'home.features':'Alle Funktionen','home.tempwarn':'Das Programm läuft aus einem temporären Verzeichnis: Beim Bereinigen der temporären Dateien können vom Programm verwendete Dateien nicht gelöscht werden (normaler Schutz). Verschieben Sie die EXE an einen festen Ort (z. B. Desktop oder D:).',
'fq.n':'Schnellreinigung per Klick','fq.d':'Reinigt automatisch 9 Kategorien von Datenmüll','fa.n':'Erweiterter benutzerdefinierter Modus','fa.d':'11 Reinigungspunkte auswählen, Gefahrenbereich rot markiert','fd.n':'Speicherplatzanzeige','fd.d':'Laufwerksbuchstaben eingeben: Gesamt / Belegt / Frei','fl.n':'Große Dateien finden','fl.d':'Native Hochgeschwindigkeits-Engine mit Multithread-Scan für große Dateien',
'quick.title':'Schnellreinigung','quick.sub':'Führt die folgenden 9 Punkte automatisch in fester Reihenfolge aus.','quick.card':'Schnellreinigung per Klick',
'common.start':'Start','common.cancel':'Abbrechen','common.ready':'Bereit','common.running':'Wird ausgeführt…','common.done':'Abgeschlossen','term.title':'Ausgabe',
'adv.title':'Erweiterte Reinigung','adv.sub':'Wählen Sie die zu reinigenden Punkte einzeln aus.','adv.safe':'Standardpunkte (sicher)','adv.danger':'Gefahrenbereich (kann die Systemwiederherstellung beeinträchtigen — Vorsicht)','adv.exec':'Ausführen','adv.selected':'Ausgewählt',
'disk.title':'Speicherplatz','disk.sub':'Laufwerksbuchstaben eingeben, um Gesamt-, Belegt- und Freispeicher anzuzeigen.','disk.query':'Abfragen','disk.err':'Ungültiger Laufwerksbuchstabe. Geben Sie einen einzelnen Buchstaben von A bis Z ein.','disk.total':'Gesamt','disk.used':'Belegt','disk.free':'Frei','disk.pct':'{p} % belegt',
'large.title':'Große Dateien','large.sub':'Schneller Multithread-Scan von C:, zeigt die ersten 20 Ergebnisse.','large.label':'Mindestgröße (GB)','large.scan':'Scan starten','large.err':'Ungültige Eingabe. Geben Sie eine Zahl ein (nur 0-9 und Punkt), z. B. 1, 2.5 oder 0.5.','large.hint':'0 scannt alle Dateien (langsam). Abbruch jederzeit möglich.','large.result':'Ergebnisse','large.count':'{n} Dateien','large.scanning':'Hochgeschwindigkeits-Scan…','large.detail':'{s} Dateien gescannt · {m} Treffer',
'set.title':'Protokolle & Einstellungen','set.sub':'Logging & Settings','set.log.name':'Globale Protokollierung','set.log.desc':'Wenn aktiviert, werden alle Reinigungsvorgänge in C:\\Log\\CleanLog.txt protokolliert (sehr geringer Speicherbedarf).','set.lang.name':'Sprache der Oberfläche','set.lang.desc':'16 Sprachen unterstützt, sofort wirksam.',
'log.refresh':'Aktualisieren','log.open':'Protokollordner öffnen','log.clean':'Reinigungsprotokoll CleanLog','log.app':'Anwendungsprotokoll','log.export':'App-Protokoll exportieren','log.none':'(Noch kein Reinigungsprotokoll erstellt)',
'about.title':'Über','about.impl':'Implementierungshinweise','about.note1':'Reinigungsbefehle stammen Byte für Byte aus dem Originalskript, unverändert;','about.note2':'Die Suche nach großen Dateien nutzt die native neo-Hochgeschwindigkeits-Engine mit Multithread-Scan;','about.note3':'Gefährliche Operationen (Löschen aller Wiederherstellungspunkte, Patch-Cache) behalten deutliche Warnungen;','about.note4':'Für das Originalerlebnis starten Sie unten die Konsolenversion.','about.bat':'Originalskript','about.plat':'Plattform','about.repo':'Original-Repository','about.ver':'Version','about.console':'Originalkonsole starten (bat)',
'toast.busy':'Eine Aufgabe läuft bereits','toast.empty':'Wählen Sie mindestens einen Punkt aus','toast.consim':'Simulationsmodus: Konsole bitte unter Windows starten','toast.conok':'Originalkonsole gestartet','toast.logon':'Globale Protokollierung aktiviert','toast.logoff':'Globale Protokollierung deaktiviert','task.end':'Aufgabe beendet (Exit-Code: {c})','checking':'Wird geprüft…','fail':'Prüfung fehlgeschlagen','hero.free':'Freier Speicher C:','adv.items':'Punkte'
},
'es': {
'large.colsize':'Tamaño','large.colpath':'Ruta del archivo',
'st.admin.got':'Obtenidos','st.admin.none':'No obtenidos (la limpieza puede ser incompleta)','st.admin.na':'N/D (modo simulación)',
'nav.home':'Inicio','nav.quick':'Limpieza rápida','nav.adv':'Limpieza avanzada','nav.disk':'Espacio en disco','nav.large':'Archivos grandes','nav.settings':'Registros y ajustes','nav.about':'Acerca de',
'home.title':'Inicio','home.hero.badge':'La nueva arquitectura neo basada en la edición original','home.hero.h2':'Devuelve tu disco C a su mejor estado','home.hero.p':'Ligero, totalmente sin conexión. La nueva arquitectura neo basada en la edición original, con motor nativo de alta velocidad.',
'home.btn.quick':'Limpieza rápida en un clic','home.btn.adv':'Limpieza avanzada personalizada','home.admin':'Permisos de administrador','home.log':'Registro global','home.cfree':'Espacio libre en C: (detección automática al iniciar)',
'home.mode':'Modo de ejecución','home.mode.win':'Modo Windows: la interfaz ejecuta el motor de limpieza integrado para una limpieza real. Todo funciona de inmediato.','home.mode.sim':'Entorno no Windows: todas las tareas muestran el flujo en modo simulación sin limpieza real. En Windows se ejecutan los comandos de limpieza reales.',
'home.features':'Todas las funciones','home.tempwarn':'El programa se ejecuta desde un directorio temporal: al limpiar archivos temporales, los archivos en uso por este programa no pueden eliminarse (protección normal). Mueva el EXE a una ubicación fija (Escritorio o D:).',
'fq.n':'Limpieza rápida en un clic','fq.d':'Limpia automáticamente 9 categorías de basura','fa.n':'Modo avanzado personalizado','fa.d':'Elija entre 11 elementos; zona de peligro en rojo','fd.n':'Visor de espacio en disco','fd.d':'Introduzca una letra de unidad para ver total / usado / libre','fl.n':'Buscador de archivos grandes','fl.d':'Motor nativo de alta velocidad con escaneo multihilo para archivos grandes',
'quick.title':'Limpieza rápida','quick.sub':'Ejecuta los siguientes 9 elementos en orden fijo, totalmente automático.','quick.card':'Limpieza rápida en un clic',
'common.start':'Iniciar','common.cancel':'Cancelar','common.ready':'Listo','common.running':'Ejecutando…','common.done':'Completado','term.title':'Salida',
'adv.title':'Limpieza avanzada','adv.sub':'Seleccione los elementos a limpiar uno por uno.','adv.safe':'Elementos estándar (seguros)','adv.danger':'Zona de peligro (puede afectar la recuperación del sistema; precaución)','adv.exec':'Ejecutar','adv.selected':'Seleccionados',
'disk.title':'Espacio en disco','disk.sub':'Introduzca una letra de unidad para ver el espacio total, usado y libre.','disk.query':'Consultar','disk.err':'Letra de unidad no válida. Introduzca una sola letra de la A a la Z.','disk.total':'Total','disk.used':'Usado','disk.free':'Libre','disk.pct':'{p}% usado',
'large.title':'Archivos grandes','large.sub':'Escaneo multihilo rápido de C:, mostrando los 20 primeros resultados.','large.label':'Tamaño mínimo (GB)','large.scan':'Iniciar escaneo','large.err':'Entrada no válida. Introduzca un número (solo dígitos y punto), p. ej. 1, 2.5 o 0.5.','large.hint':'0 escanea todos los archivos (lento). Puede cancelar en cualquier momento.','large.result':'Resultados','large.count':'{n} archivos','large.scanning':'Escaneo de alta velocidad…','large.detail':'{s} archivos escaneados · {m} coincidentes',
'set.title':'Registros y ajustes','set.sub':'Logging & Settings','set.log.name':'Registro global','set.log.desc':'Si está activado, todas las operaciones se registran en C:\\Log\\CleanLog.txt (ocupa muy poco).','set.lang.name':'Idioma de la interfaz','set.lang.desc':'16 idiomas disponibles; el cambio es inmediato.',
'log.refresh':'Actualizar','log.open':'Abrir carpeta de registros','log.clean':'Registro de limpieza CleanLog','log.app':'Registro de la aplicación','log.export':'Exportar registro','log.none':'(Aún no se ha generado registro de limpieza)',
'about.title':'Acerca de','about.impl':'Notas de implementación','about.note1':'Los comandos de limpieza se toman del script original byte a byte, sin modificación;','about.note2':'La búsqueda de archivos grandes usa el motor nativo neo de alta velocidad con escaneo multihilo;','about.note3':'Las operaciones peligrosas (eliminar todos los puntos de restauración, caché de parches) conservan advertencias visibles;','about.note4':'Para la experiencia original, pulse abajo para iniciar la versión de consola.','about.bat':'Script original','about.plat':'Plataforma','about.repo':'Repositorio original','about.ver':'Versión','about.console':'Iniciar consola original (bat)',
'toast.busy':'Ya hay una tarea en ejecución','toast.empty':'Seleccione al menos un elemento','toast.consim':'Modo simulación: ejecute en Windows para iniciar la consola','toast.conok':'Consola original iniciada','toast.logon':'Registro global activado','toast.logoff':'Registro global desactivado','task.end':'Tarea finalizada (código: {c})','checking':'Comprobando…','fail':'Error de comprobación','hero.free':'Espacio libre en C:','adv.items':'elementos'
},
'ru': {
'large.colsize':'Размер','large.colpath':'Путь к файлу',
'st.admin.got':'Получены','st.admin.none':'Не получены (очистка может быть неполной)','st.admin.na':'Н/Д (режим симуляции)',
'nav.home':'Главная','nav.quick':'Быстрая очистка','nav.adv':'Расширенная очистка','nav.disk':'Диск','nav.large':'Большие файлы','nav.settings':'Журналы и настройки','nav.about':'О программе',
'home.title':'Главная','home.hero.badge':'Новая архитектура neo на базе прежней версии','home.hero.h2':'Верните диску C лучшее состояние','home.hero.p':'Лёгкий, полностью автономный. Новая архитектура neo на базе прежней версии с нативным скоростным движком.',
'home.btn.quick':'Быстрая очистка в один клик','home.btn.adv':'Настраиваемая расширенная очистка','home.admin':'Права администратора','home.log':'Глобальный журнал','home.cfree':'Свободно на C: (автоопределение при запуске)',
'home.mode':'Режим работы','home.mode.win':'Режим Windows: интерфейс запускает встроенный движок очистки для реальной очистки. Всё работает сразу.','home.mode.sim':'Запуск в среде, отличной от Windows: все задачи демонстрируют интерфейс в режиме симуляции без реальной очистки. В Windows выполняются реальные команды очистки.',
'home.features':'Все функции','home.tempwarn':'Программа запущена из временного каталога: при очистке временных файлы, используемые программой, удалить нельзя (нормальная защита). Переместите EXE в постоянное место (Рабочий стол или D:).',
'fq.n':'Быстрая очистка в один клик','fq.d':'Автоматически очищает 9 категорий мусора','fa.n':'Расширенный режим','fa.d':'Выбор из 11 пунктов, опасная зона выделена красным','fd.n':'Просмотр диска','fd.d':'Введите букву диска: всего / занято / свободно','fl.n':'Поиск больших файлов','fl.d':'Нативный скоростной движок с многопоточным сканированием больших файлов',
'quick.title':'Быстрая очистка','quick.sub':'Автоматически выполняет 9 пунктов в фиксированном порядке.','quick.card':'Быстрая очистка в один клик',
'common.start':'Пуск','common.cancel':'Отмена','common.ready':'Готово','common.running':'Выполняется…','common.done':'Завершено','term.title':'Вывод',
'adv.title':'Расширенная очистка','adv.sub':'Выбирайте пункты по одному.','adv.safe':'Стандартные пункты (безопасно)','adv.danger':'Опасная зона (может повлиять на восстановление системы — осторожно)','adv.exec':'Выполнить','adv.selected':'Выбрано',
'disk.title':'Диск','disk.sub':'Введите букву диска, чтобы увидеть общий, занятый и свободный объём.','disk.query':'Запрос','disk.err':'Неверная буква диска. Введите одну букву от A до Z.','disk.total':'Всего','disk.used':'Занято','disk.free':'Свободно','disk.pct':'Занято {p}%',
'large.title':'Большие файлы','large.sub':'Быстрое многопоточное сканирование диска C:, показываются первые 20 результатов.','large.label':'Минимальный размер (ГБ)','large.scan':'Начать сканирование','large.err':'Неверный ввод. Введите число (только цифры и точка), например 1, 2.5 или 0.5.','large.hint':'0 — сканировать все файлы (медленно). Отмена возможна в любой момент.','large.result':'Результаты','large.count':'Файлов: {n}','large.scanning':'Скоростное сканирование…','large.detail':'Просканировано файлов: {s} · совпадений: {m}',
'set.title':'Журналы и настройки','set.sub':'Logging & Settings','set.log.name':'Глобальный журнал','set.log.desc':'При включении все операции очистки записываются в C:\\Log\\CleanLog.txt (занимает мало места).','set.lang.name':'Язык интерфейса','set.lang.desc':'Поддерживается 16 языков, переключение мгновенное.',
'log.refresh':'Обновить','log.open':'Открыть папку журналов','log.clean':'Журнал очистки CleanLog','log.app':'Журнал приложения','log.export':'Экспорт журнала','log.none':'(Журнал очистки ещё не создан)',
'about.title':'О программе','about.impl':'Примечания к реализации','about.note1':'Команды очистки взяты из оригинального скрипта байт в байт без изменений;','about.note2':'Поиск больших файлов использует нативный скоростной движок neo с многопоточным сканированием;','about.note3':'Опасные операции (удаление всех точек восстановления, кэш исправлений) сохраняют заметные предупреждения;','about.note4':'Для оригинального опыта запустите консольную версию кнопкой ниже.','about.bat':'Оригинальный скрипт','about.plat':'Платформа','about.repo':'Оригинальный репозиторий','about.ver':'Версия','about.console':'Запустить оригинальную консоль (bat)',
'toast.busy':'Задача уже выполняется','toast.empty':'Выберите хотя бы один пункт','toast.consim':'Режим симуляции: консоль доступна только в Windows','toast.conok':'Оригинальная консоль запущена','toast.logon':'Глобальный журнал включён','toast.logoff':'Глобальный журнал выключен','task.end':'Задача завершена (код: {c})','checking':'Проверка…','fail':'Ошибка проверки','hero.free':'Свободно на C:','adv.items':'пунктов'
},
'pt': {
'large.colsize':'Tamanho','large.colpath':'Caminho do arquivo',
'st.admin.got':'Obtidos','st.admin.none':'Não obtidos (limpeza pode ser incompleta)','st.admin.na':'N/D (modo simulação)',
'nav.home':'Início','nav.quick':'Limpeza rápida','nav.adv':'Limpeza avançada','nav.disk':'Espaço em disco','nav.large':'Arquivos grandes','nav.settings':'Logs e configurações','nav.about':'Sobre',
'home.title':'Início','home.hero.badge':'A nova arquitetura neo baseada na edição original','home.hero.h2':'Devolva o disco C ao melhor estado','home.hero.p':'Leve, totalmente offline. A nova arquitetura neo baseada na edição original, com motor nativo de alta velocidade.',
'home.btn.quick':'Limpeza rápida em um clique','home.btn.adv':'Limpeza avançada personalizada','home.admin':'Privilégios de administrador','home.log':'Log global','home.cfree':'Espaço livre em C: (detecção automática ao iniciar)',
'home.mode':'Modo de execução','home.mode.win':'Modo Windows: a interface aciona o motor de limpeza integrado para limpeza real. Tudo funciona imediatamente.','home.mode.sim':'Ambiente não Windows: todas as tarefas demonstram o fluxo em modo simulação, sem limpeza real. No Windows, os comandos reais de limpeza são executados.',
'home.features':'Todas as funções','home.tempwarn':'O programa está sendo executado a partir de um diretório temporário: ao limpar arquivos temporários, os arquivos em uso por este programa não podem ser excluídos (proteção normal). Mova o EXE para um local fixo (Área de trabalho ou D:).',
'fq.n':'Limpeza rápida em um clique','fq.d':'Limpa automaticamente 9 categorias de lixo','fa.n':'Modo avançado personalizado','fa.d':'Escolha entre 11 itens; zona de perigo em vermelho','fd.n':'Visualizador de espaço em disco','fd.d':'Digite uma letra de unidade para ver total / usado / livre','fl.n':'Localizador de arquivos grandes','fl.d':'Motor nativo de alta velocidade com varredura multithread para arquivos grandes',
'quick.title':'Limpeza rápida','quick.sub':'Executa os 9 itens abaixo em ordem fixa, totalmente automático.','quick.card':'Limpeza rápida em um clique',
'common.start':'Iniciar','common.cancel':'Cancelar','common.ready':'Pronto','common.running':'Executando…','common.done':'Concluído','term.title':'Saída',
'adv.title':'Limpeza avançada','adv.sub':'Selecione os itens a limpar um a um.','adv.safe':'Itens padrão (seguros)','adv.danger':'Zona de perigo (pode afetar a recuperação do sistema — cautela)','adv.exec':'Executar','adv.selected':'Selecionados',
'disk.title':'Espaço em disco','disk.sub':'Digite uma letra de unidade para ver o espaço total, usado e livre.','disk.query':'Consultar','disk.err':'Letra de unidade inválida. Digite uma única letra de A a Z.','disk.total':'Total','disk.used':'Usado','disk.free':'Livre','disk.pct':'{p}% usado',
'large.title':'Arquivos grandes','large.sub':'Varredura multithread rápida do disco C:, exibindo os 20 primeiros resultados.','large.label':'Tamanho mínimo (GB)','large.scan':'Iniciar varredura','large.err':'Entrada inválida. Digite um número (apenas dígitos e ponto), ex.: 1, 2.5 ou 0.5.','large.hint':'0 varre todos os arquivos (lento). Cancelamento possível a qualquer momento.','large.result':'Resultados','large.count':'{n} arquivos','large.scanning':'Varredura de alta velocidade…','large.detail':'{s} arquivos varridos · {m} correspondentes',
'set.title':'Logs e configurações','set.sub':'Logging & Settings','set.log.name':'Log global','set.log.desc':'Quando ativado, todas as operações são registradas em C:\\Log\\CleanLog.txt (ocupa pouquíssimo espaço).','set.lang.name':'Idioma da interface','set.lang.desc':'16 idiomas suportados, aplicação imediata.',
'log.refresh':'Atualizar','log.open':'Abrir pasta de logs','log.clean':'Log de limpeza CleanLog','log.app':'Log do aplicativo','log.export':'Exportar log','log.none':'(Nenhum log de limpeza gerado ainda)',
'about.title':'Sobre','about.impl':'Notas de implementação','about.note1':'Os comandos de limpeza são extraídos do script original byte a byte, sem modificação;','about.note2':'A busca de arquivos grandes usa o motor nativo neo de alta velocidade com varredura multithread;','about.note3':'Operações perigosas (excluir todos os pontos de restauração, cache de patches) mantêm avisos visíveis;','about.note4':'Para a experiência original, clique abaixo para iniciar a versão de console.','about.bat':'Script original','about.plat':'Plataforma','about.repo':'Repositório original','about.ver':'Versão','about.console':'Iniciar console original (bat)',
'toast.busy':'Já existe uma tarefa em execução','toast.empty':'Selecione pelo menos um item','toast.consim':'Modo simulação: execute no Windows para iniciar o console','toast.conok':'Console original iniciado','toast.logon':'Log global ativado','toast.logoff':'Log global desativado','task.end':'Tarefa encerrada (código: {c})','checking':'Verificando…','fail':'Falha na verificação','hero.free':'Espaço livre em C:','adv.items':'itens'
},
'it': {
'large.colsize':'Dimensione','large.colpath':'Percorso file',
'st.admin.got':'Ottenuti','st.admin.none':'Non ottenuti (pulizia potenzialmente incompleta)','st.admin.na':'N/D (modalità simulazione)',
'nav.home':'Home','nav.quick':'Pulizia rapida','nav.adv':'Pulizia avanzata','nav.disk':'Spazio disco','nav.large':'File di grandi dimensioni','nav.settings':'Log e impostazioni','nav.about':'Info',
'home.title':'Home','home.hero.badge':'La nuova architettura neo basata sull\'edizione originale','home.hero.h2':'Riporta il disco C al meglio','home.hero.p':'Leggero, completamente offline. La nuova architettura neo basata sull\'edizione originale, con motore nativo ad alta velocità.',
'home.btn.quick':'Pulizia rapida in un clic','home.btn.adv':'Pulizia avanzata personalizzata','home.admin':'Privilegi di amministratore','home.log':'Log globale','home.cfree':'Spazio libero su C: (rilevamento automatico all\'avvio)',
'home.mode':'Modalità di esecuzione','home.mode.win':'Modalità Windows: l\'interfaccia esegue il motore di pulizia integrato per una pulizia reale. Tutto funziona subito.','home.mode.sim':'Ambiente non Windows: tutte le attività mostrano il flusso in modalità simulazione senza pulizia reale. Su Windows vengono eseguiti i comandi di pulizia reali.',
'home.features':'Tutte le funzioni','home.tempwarn':'Il programma è in esecuzione da una directory temporanea: durante la pulizia dei file temporanei, i file in uso da questo programma non possono essere eliminati (protezione normale). Sposta l\'EXE in una posizione fissa (Desktop o D:).',
'fq.n':'Pulizia rapida in un clic','fq.d':'Pulisce automaticamente 9 categorie di file inutili','fa.n':'Modalità avanzata personalizzata','fa.d':'Scegli tra 11 elementi; zona pericolosa in rosso','fd.n':'Visualizzatore spazio disco','fd.d':'Inserisci una lettera di unità per vedere totale / usato / libero','fl.n':'Ricerca file grandi','fl.d':'Motore nativo ad alta velocità con scansione multithread per file grandi',
'quick.title':'Pulizia rapida','quick.sub':'Esegue i 9 elementi seguenti in ordine fisso, completamente automatico.','quick.card':'Pulizia rapida in un clic',
'common.start':'Avvia','common.cancel':'Annulla','common.ready':'Pronto','common.running':'In esecuzione…','common.done':'Completato','term.title':'Output',
'adv.title':'Pulizia avanzata','adv.sub':'Seleziona gli elementi da pulire uno per uno.','adv.safe':'Elementi standard (sicuri)','adv.danger':'Zona pericolosa (può influire sul ripristino del sistema — cautela)','adv.exec':'Esegui','adv.selected':'Selezionati',
'disk.title':'Spazio disco','disk.sub':'Inserisci una lettera di unità per vedere lo spazio totale, usato e libero.','disk.query':'Consulta','disk.err':'Lettera di unità non valida. Inserisci una singola lettera da A a Z.','disk.total':'Totale','disk.used':'Usato','disk.free':'Libero','disk.pct':'{p}% usato',
'large.title':'File grandi','large.sub':'Scansione multithread veloce di C:, mostrando i primi 20 risultati.','large.label':'Dimensione minima (GB)','large.scan':'Avvia scansione','large.err':'Input non valido. Inserisci un numero (solo cifre e punto), es. 1, 2.5 o 0.5.','large.hint':'0 scansiona tutti i file (lento). Annullamento possibile in qualsiasi momento.','large.result':'Risultati','large.count':'{n} file','large.scanning':'Scansione ad alta velocità…','large.detail':'{s} file scansionati · {m} corrispondenti',
'set.title':'Log e impostazioni','set.sub':'Logging & Settings','set.log.name':'Log globale','set.log.desc':'Se attivato, tutte le operazioni vengono registrate in C:\\Log\\CleanLog.txt (occupa pochissimo spazio).','set.lang.name':'Lingua dell\'interfaccia','set.lang.desc':'16 lingue supportate, effetto immediato.',
'log.refresh':'Aggiorna','log.open':'Apri cartella log','log.clean':'Log di pulizia CleanLog','log.app':'Log dell\'applicazione','log.export':'Esporta log','log.none':'(Nessun log di pulizia ancora generato)',
'about.title':'Info','about.impl':'Note di implementazione','about.note1':'I comandi di pulizia sono presi dallo script originale byte per byte, senza modifiche;','about.note2':'La ricerca di file grandi usa il motore nativo neo ad alta velocità con scansione multithread;','about.note3':'Le operazioni pericolose (eliminazione di tutti i punti di ripristino, cache delle patch) mantengono avvisi evidenti;','about.note4':'Per l\'esperienza originale, clicca qui sotto per avviare la versione console.','about.bat':'Script originale','about.plat':'Piattaforma','about.repo':'Repository originale','about.ver':'Versione','about.console':'Avvia console originale (bat)',
'toast.busy':'Un\'attività è già in esecuzione','toast.empty':'Seleziona almeno un elemento','toast.consim':'Modalità simulazione: avvia la console su Windows','toast.conok':'Console originale avviata','toast.logon':'Log globale attivato','toast.logoff':'Log globale disattivato','task.end':'Attività terminata (codice: {c})','checking':'Verifica…','fail':'Verifica non riuscita','hero.free':'Spazio libero su C:','adv.items':'elementi'
},
'ar': {
'large.colsize':'الحجم','large.colpath':'مسار الملف',
'st.admin.got':'تم الحصول عليها','st.admin.none':'غير متوفرة (قد تكون التنظيفات غير مكتملة)','st.admin.na':'غير متاح (وضع المحاكاة)',
'nav.home':'الرئيسية','nav.quick':'تنظيف سريع','nav.adv':'تنظيف متقدم','nav.disk':'مساحة القرص','nav.large':'ملفات كبيرة','nav.settings':'السجلات والإعدادات','nav.about':'حول',
'home.title':'الرئيسية','home.hero.badge':'بنية neo الجديدة المبنية على الإصدار الأصلي','home.hero.h2':'أعد قرص C إلى أفضل حالة','home.hero.p':'خفيف وغير متصل بالكامل. بنية neo الجديدة المبنية على الإصدار الأصلي، مع محرك أصلي عالي السرعة.',
'home.btn.quick':'تنظيف سريع بنقرة واحدة','home.btn.adv':'تنظيف متقدم مخصص','home.admin':'صلاحيات المسؤول','home.log':'السجل العام','home.cfree':'المساحة الحرة في C: (كشف تلقائي عند البدء)',
'home.mode':'وضع التشغيل','home.mode.win':'وضع Windows: تشغّل الواجهة محرك التنظيف المدمج لتنظيف فعلي. كل الوظائف جاهزة فورًا.','home.mode.sim':'بيئة غير Windows: جميع المهام تعرض الواجهة في وضع المحاكاة دون تنظيف فعلي. على Windows تُنفَّذ أوامر التنظيف الحقيقية.',
'home.features':'جميع الوظائف','home.tempwarn':'يعمل البرنامج من مجلد مؤقت: أثناء تنظيف الملفات المؤقتة لا يمكن حذف الملفات التي يستخدمها البرنامج (حماية طبيعية). انقل ملف EXE إلى موقع ثابت (سطح المكتب أو D:).',
'fq.n':'تنظيف سريع بنقرة واحدة','fq.d':'ينظف تلقائيًا 9 فئات من الملفات غير الضرورية','fa.n':'الوضع المتقدم المخصص','fa.d':'اختر من 11 عنصرًا، المنطقة الخطرة باللون الأحمر','fd.n':'عارض مساحة القرص','fd.d':'أدخل حرف محرك الأقراص لعرض الإجمالي / المستخدم / الحر','fl.n':'الباحث عن الملفات الكبيرة','fl.d':'محرك أصلي عالي السرعة بفحص متعدد الخيوط لتحديد الملفات الكبيرة',
'quick.title':'تنظيف سريع','quick.sub':'ينفذ العناصر التسعة التالية بترتيب ثابت تلقائيًا بالكامل.','quick.card':'تنظيف سريع بنقرة واحدة',
'common.start':'ابدأ','common.cancel':'إلغاء','common.ready':'جاهز','common.running':'جارٍ التنفيذ…','common.done':'اكتمل','term.title':'الإخراج',
'adv.title':'تنظيف متقدم','adv.sub':'اختر عناصر التنظيف واحدًا تلو الآخر.','adv.safe':'عناصر قياسية (آمنة)','adv.danger':'منطقة الخطر (قد تؤثر على استعادة النظام — توخَّ الحذر)','adv.exec':'تنفيذ','adv.selected':'المحددة',
'disk.title':'مساحة القرص','disk.sub':'أدخل حرف محرك الأقراص لعرض المساحة الكلية والمستخدم والحرة.','disk.query':'استعلام','disk.err':'حرف محرك غير صالح. أدخل حرفًا واحدًا من A إلى Z.','disk.total':'الإجمالي','disk.used':'المستخدم','disk.free':'الحر','disk.pct':'المستخدم {p}%',
'large.title':'ملفات كبيرة','large.sub':'فحص سريع متعدد الخيوط للقرص C:، مع عرض أول 20 نتيجة.','large.label':'الحد الأدنى للحجم (GB)','large.scan':'بدء الفحص','large.err':'إدخال غير صالح. أدخل رقمًا (أرقام ونقطة فقط)، مثل 1 أو 2.5 أو 0.5.','large.hint':'0 يفحص جميع الملفات (بطيء). يمكن الإلغاء في أي وقت.','large.result':'النتائج','large.count':'{n} ملفات','large.scanning':'فحص عالي السرعة…','large.detail':'تم فحص {s} ملفًا · {m} نتائج مطابقة',
'set.title':'السجلات والإعدادات','set.sub':'Logging & Settings','set.log.name':'السجل العام','set.log.desc':'عند التفعيل تُسجَّل جميع عمليات التنظيف في C:\\Log\\CleanLog.txt (بمساحة ضئيلة جدًا).','set.lang.name':'لغة الواجهة','set.lang.desc':'يدعم 16 لغة، والتغيير فوري.',
'log.refresh':'تحديث','log.open':'فتح مجلد السجلات','log.clean':'سجل التنظيف CleanLog','log.app':'سجل التطبيق','log.export':'تصدير السجل','log.none':'(لم يتم إنشاء سجل تنظيف بعد)',
'about.title':'حول','about.impl':'ملاحظات التنفيذ','about.note1':'أوامر التنظيف مأخوذة من النص الأصلي بايت بايت دون تعديل؛','about.note2':'يستخدم البحث عن الملفات الكبيرة محرك neo الأصلي عالي السرعة بفحص متعدد الخيوط؛','about.note3':'العمليات الخطرة (حذف جميع نقاط الاستعادة، ذاكرة التصحيحات) تحتفظ بتحذيرات واضحة؛','about.note4':'للحصول على التجربة الأصلية، انقر أدناه لتشغيل إصدار وحدة التحكم.','about.bat':'النص الأصلي','about.plat':'النظام الأساسي','about.repo':'المستودع الأصلي','about.ver':'الإصدار','about.console':'تشغيل وحدة التحكم الأصلية (bat)',
'toast.busy':'هناك مهمة قيد التشغيل بالفعل','toast.empty':'اختر عنصرًا واحدًا على الأقل','toast.consim':'وضع المحاكاة: شغّل على Windows لفتح وحدة التحكم','toast.conok':'تم تشغيل وحدة التحكم الأصلية','toast.logon':'تم تفعيل السجل العام','toast.logoff':'تم تعطيل السجل العام','task.end':'انتهت المهمة (الرمز: {c})','checking':'جارٍ الفحص…','fail':'فشل الفحص','hero.free':'المساحة الحرة في C:','adv.items':'عناصر'
},
'hi': {
'large.colsize':'आकार','large.colpath':'फ़ाइल पथ',
'st.admin.got':'प्राप्त','st.admin.none':'प्राप्त नहीं (सफाई अधूरी हो सकती है)','st.admin.na':'लागू नहीं (सिमुलेशन मोड)',
'nav.home':'होम','nav.quick':'त्वरित सफाई','nav.adv':'उन्नत सफाई','nav.disk':'डिस्क स्थान','nav.large':'बड़ी फ़ाइलें','nav.settings':'लॉग और सेटिंग्स','nav.about':'के बारे में',
'home.title':'होम','home.hero.badge':'पुराने संस्करण पर आधारित नई neo आर्किटेक्चर','home.hero.h2':'C ड्राइव को सर्वोत्तम स्थिति में लाएँ','home.hero.p':'हल्का, पूरी तरह ऑफ़लाइन। पुराने संस्करण पर आधारित नई neo आर्किटेक्चर, नेटिव हाई-स्पीड इंजन के साथ।',
'home.btn.quick':'एक-क्लिक त्वरित सफाई','home.btn.adv':'कस्टम उन्नत सफाई','home.admin':'व्यवस्थापक अधिकार','home.log':'वैश्विक लॉग','home.cfree':'C ड्राइव खाली (स्टार्टअप पर स्वतः जाँच)',
'home.mode':'चलन मोड','home.mode.win':'Windows मोड: GUI अंतर्निहित सफाई इंजन को चलाकर वास्तविक सफाई करता है। सब कुछ तुरंत काम करता है।','home.mode.sim':'गैर-Windows वातावरण: सभी कार्य सिमुलेशन मोड में UI प्रवाह दिखाते हैं, कोई वास्तविक सफाई नहीं। Windows पर वास्तविक सफाई कमांड चलते हैं।',
'home.features':'सभी सुविधाएँ','home.tempwarn':'प्रोग्राम अस्थायी निर्देशिका से चल रहा है: अस्थायी फ़ाइलों की सफाई के दौरान इस प्रोग्राम द्वारा उपयोग की जा रही फ़ाइलें हटाई नहीं जा सकतीं (सामान्य सुरक्षा)। EXE को स्थायी स्थान (डेस्कटॉप या D:) पर ले जाएँ।',
'fq.n':'एक-क्लिक त्वरित सफाई','fq.d':'9 सामान्य जंक श्रेणियों को स्वतः साफ करता है','fa.n':'उन्नत कस्टम मोड','fa.d':'11 मदों में से चुनें, खतरनाक क्षेत्र लाल रंग में','fd.n':'डिस्क स्थान दर्शक','fd.d':'कुल / उपयोग / खाली देखने के लिए ड्राइव अक्षर दर्ज करें','fl.n':'बड़ी फ़ाइल खोजक','fl.d':'बड़ी फ़ाइलों के लिए नेटिव हाई-स्पीड इंजन मल्टी-थ्रेडेड स्कैन',
'quick.title':'त्वरित सफाई','quick.sub':'निम्न 9 मदों को निश्चित क्रम में पूरी तरह स्वचालित रूप से चलाता है।','quick.card':'एक-क्लिक त्वरित सफाई',
'common.start':'शुरू करें','common.cancel':'रद्द करें','common.ready':'तैयार','common.running':'चल रहा है…','common.done':'पूर्ण','term.title':'आउटपुट',
'adv.title':'उन्नत सफाई','adv.sub':'साफ़ करने वाली मदों को एक-एक करके चुनें।','adv.safe':'मानक मदें (सुरक्षित)','adv.danger':'खतरा क्षेत्र (सिस्टम पुनर्प्राप्ति को प्रभावित कर सकता है — सावधानी)','adv.exec':'चलाएँ','adv.selected':'चयनित',
'disk.title':'डिस्क स्थान','disk.sub':'कुल, उपयोग और खाली स्थान देखने के लिए ड्राइव अक्षर दर्ज करें।','disk.query':'पूछताछ','disk.err':'अमान्य ड्राइव अक्षर। A से Z तक एक ही अक्षर दर्ज करें।','disk.total':'कुल','disk.used':'उपयोग','disk.free':'खाली','disk.pct':'{p}% उपयोग',
'large.title':'बड़ी फ़ाइलें','large.sub':'C ड्राइव का तेज़ मल्टी-थ्रेडेड स्कैन, पहले 20 परिणाम दिखाए जाते हैं।','large.label':'न्यूनतम फ़ाइल आकार (GB)','large.scan':'स्कैन शुरू करें','large.err':'अमान्य इनपुट। संख्या दर्ज करें (केवल 0-9 और दशमलव), जैसे 1, 2.5 या 0.5।','large.hint':'0 सभी फ़ाइलों को स्कैन करेगा (धीमा)। किसी भी समय रद्द कर सकते हैं।','large.result':'परिणाम','large.count':'{n} फ़ाइलें','large.scanning':'हाई-स्पीड स्कैन जारी…','large.detail':'{s} फ़ाइलें स्कैन की गईं · {m} मिलान',
'set.title':'लॉग और सेटिंग्स','set.sub':'Logging & Settings','set.log.name':'वैश्विक लॉग','set.log.desc':'सक्षम होने पर सभी सफाई कार्य C:\\Log\\CleanLog.txt में दर्ज होते हैं (बहुत कम स्थान)।','set.lang.name':'इंटरफ़ेस भाषा','set.lang.desc':'16 भाषाएँ समर्थित, बदलाव तुरंत लागू।',
'log.refresh':'रिफ़्रेश','log.open':'लॉग फ़ोल्डर खोलें','log.clean':'सफाई लॉग CleanLog','log.app':'ऐप्लिकेशन लॉग','log.export':'ऐप लॉग निर्यात करें','log.none':'(अभी कोई सफाई लॉग नहीं बना)',
'about.title':'के बारे में','about.impl':'कार्यान्वयन नोट्स','about.note1':'सफाई कमांड मूल स्क्रिप्ट से बाइट-दर-बाइट लिए गए हैं, बिना किसी बदलाव के;','about.note2':'बड़ी फ़ाइल खोज neo नेटिव हाई-स्पीड इंजन के मल्टी-थ्रेडेड स्कैन का उपयोग करती है;','about.note3':'खतरनाक कार्य (सभी रिस्टोर पॉइंट हटाना, पैच कैश) स्पष्ट चेतावनियाँ बनाए रखते हैं;','about.note4':'मूल अनुभव के लिए नीचे बटन से कंसोल संस्करण चलाएँ।','about.bat':'मूल स्क्रिप्ट','about.plat':'प्लेटफ़ॉर्म','about.repo':'मूल रिपोज़िटरी','about.ver':'संस्करण','about.console':'मूल कंसोल चलाएँ (bat)',
'toast.busy':'एक कार्य पहले से चल रहा है','toast.empty':'कम से कम एक सफाई मद चुनें','toast.consim':'सिमुलेशन मोड: कंसोल संस्करण Windows पर चलाएँ','toast.conok':'मूल कंसोल चालू','toast.logon':'वैश्विक लॉग सक्षम','toast.logoff':'वैश्विक लॉग अक्षम','task.end':'कार्य समाप्त (कोड: {c})','checking':'जाँच हो रही है…','fail':'जाँच विफल','hero.free':'C ड्राइव खाली','adv.items':'मदें'
},
'th': {
'large.colsize':'ขนาด','large.colpath':'เส้นทางไฟล์',
'st.admin.got':'ได้รับแล้ว','st.admin.none':'ยังไม่ได้รับ (การล้างอาจไม่สมบูรณ์)','st.admin.na':'ไม่ใช้ (โหมดจำลอง)',
'nav.home':'หน้าแรก','nav.quick':'ล้างด่วน','nav.adv':'ล้างขั้นสูง','nav.disk':'พื้นที่ดิสก์','nav.large':'ไฟล์ขนาดใหญ่','nav.settings':'บันทึกและการตั้งค่า','nav.about':'เกี่ยวกับ',
'home.title':'หน้าแรก','home.hero.badge':'สถาปัตยกรรม neo ใหม่ที่สร้างจากเวอร์ชันเดิม','home.hero.h2':'พาไดรฟ์ C กลับสู่สภาพที่ดีที่สุด','home.hero.p':'เบา ทำงานออฟไลน์เต็มที่ สถาปัตยกรรม neo ใหม่ที่สร้างจากเวอร์ชันเดิม พร้อมเอนจินความเร็วสูงในตัว',
'home.btn.quick':'ล้างด่วนในคลิกเดียว','home.btn.adv':'ล้างขั้นสูงแบบกำหนดเอง','home.admin':'สิทธิ์ผู้ดูแลระบบ','home.log':'บันทึกส่วนกลาง','home.cfree':'พื้นที่ว่างไดรฟ์ C (ตรวจอัตโนมัติเมื่อเปิด)',
'home.mode':'โหมดการทำงาน','home.mode.win':'โหมด Windows: อินเทอร์เฟซจะขับเอนจินการล้างในตัวเพื่อล้างจริง ใช้งานได้ทันทีทุกฟังก์ชัน','home.mode.sim':'สภาพแวดล้อมที่ไม่ใช่ Windows: งานทั้งหมดจะสาธิต流程ในโหมดจำลองโดยไม่ล้างจริง บน Windows จะรันคำสั่งล้างจริง',
'home.features':'ฟีเจอร์ทั้งหมด','home.tempwarn':'โปรแกรมกำลังทำงานจากไดเรกทอรีชั่วคราว: ขณะล้างไฟล์ชั่วคราว ไฟล์ที่โปรแกรมใช้อยู่จะถูกลบไม่ได้ (การป้องกันปกติ) ย้าย EXE ไปตำแหน่งถาวร (เดสก์ท็อปหรือ D:) เพื่อผลลัพธ์ที่ดีที่สุด',
'fq.n':'ล้างด่วนในคลิกเดียว','fq.d':'ล้างขยะทั่วไป 9 ประเภทโดยอัตโนมัติ','fa.n':'โหมดขั้นสูงแบบกำหนดเอง','fa.d':'เลือกจาก 11 รายการ โซนอันตรายแสดงด้วยสีแดง','fd.n':'ตัวดูพื้นที่ดิสก์','fd.d':'ใส่ตัวอักษรไดรฟ์เพื่อดูทั้งหมด / ใช้ไป / ว่าง','fl.n':'ตัวค้นหาไฟล์ขนาดใหญ่','fl.d':'เอนจินความเร็วสูงในตัว สแกนแบบมัลติเธรดเพื่อหาไฟล์ขนาดใหญ่',
'quick.title':'ล้างด่วน','quick.sub':'รัน 9 รายการต่อไปนี้ตามลำดับคงที่ อัตโนมัติทั้งหมด','quick.card':'ล้างด่วนในคลิกเดียว',
'common.start':'เริ่ม','common.cancel':'ยกเลิก','common.ready':'พร้อม','common.running':'กำลังทำงาน…','common.done':'เสร็จสิ้น','term.title':'เอาต์พุต',
'adv.title':'ล้างขั้นสูง','adv.sub':'เลือกรายการที่จะล้างทีละรายการ','adv.safe':'รายการมาตรฐาน (ปลอดภัย)','adv.danger':'โซนอันตราย (อาจส่งผลต่อการกู้คืนระบบ — โปรดระวัง)','adv.exec':'ดำเนินการ','adv.selected':'เลือกแล้ว',
'disk.title':'พื้นที่ดิสก์','disk.sub':'ใส่ตัวอักษรไดรฟ์เพื่อดูพื้นที่ทั้งหมด ใช้ไป และว่าง','disk.query':'สอบถาม','disk.err':'ตัวอักษรไดรฟ์ไม่ถูกต้อง กรุณาใส่ตัวอักษรเดียว A ถึง Z','disk.total':'ทั้งหมด','disk.used':'ใช้ไป','disk.free':'ว่าง','disk.pct':'ใช้ไป {p}%',
'large.title':'ไฟล์ขนาดใหญ่','large.sub':'สแกนไดรฟ์ C แบบมัลติเธรดความเร็วสูง แสดง 20 ผลลัพธ์แรก','large.label':'ขนาดไฟล์ขั้นต่ำ (GB)','large.scan':'เริ่มสแกน','large.err':'ข้อมูลไม่ถูกต้อง กรุณาใส่ตัวเลข (0-9 และจุดเท่านั้น) เช่น 1, 2.5 หรือ 0.5','large.hint':'ใส่ 0 จะสแกนทุกไฟล์ (ช้า) ยกเลิกได้ทุกเมื่อ','large.result':'ผลลัพธ์','large.count':'{n} ไฟล์','large.scanning':'กำลังสแกนความเร็วสูง…','large.detail':'สแกนแล้ว {s} ไฟล์ · ตรงกัน {m} รายการ',
'set.title':'บันทึกและการตั้งค่า','set.sub':'Logging & Settings','set.log.name':'บันทึกส่วนกลาง','set.log.desc':'เมื่อเปิดใช้งาน การล้างทั้งหมดจะถูกบันทึกใน C:\\Log\\CleanLog.txt (ใช้พื้นที่น้อยมาก)','set.lang.name':'ภาษาของอินเทอร์เฟซ','set.lang.desc':'รองรับ 16 ภาษา เปลี่ยนแล้วมีผลทันที',
'log.refresh':'รีเฟรช','log.open':'เปิดโฟลเดอร์บันทึก','log.clean':'บันทึกการล้าง CleanLog','log.app':'บันทึกการทำงานของแอป','log.export':'ส่งออกบันทึก','log.none':'(ยังไม่มีบันทึกการล้าง)',
'about.title':'เกี่ยวกับ','about.impl':'หมายเหตุการใช้งาน','about.note1':'คำสั่งล้างนำมาจากสคริปต์ต้นฉบับแบบไบต์ต่อไบต์โดยไม่มีการแก้ไข','about.note2':'การหาไฟล์ขนาดใหญ่ใช้เอนจินความเร็วสูง neo แบบมัลติเธรด','about.note3':'การทำงานที่อันตราย (ลบจุดคืนค่าทั้งหมด, แคชแพตช์) ยังคงคำเตือนที่ชัดเจน','about.note4':'หากต้องการประสบการณ์ดั้งเดิม คลิกปุ่มด้านล่างเพื่อเปิดเวอร์ชันคอนโซล','about.bat':'สคริปต์ต้นฉบับ','about.plat':'แพลตฟอร์ม','about.repo':'รีพอซิทอรีต้นฉบับ','about.ver':'เวอร์ชัน','about.console':'เปิดคอนโซลต้นฉบับ (bat)',
'toast.busy':'มีงานกำลังทำงานอยู่','toast.empty':'กรุณาเลือกอย่างน้อยหนึ่งรายการ','toast.consim':'โหมดจำลอง: รันบน Windows เพื่อเปิดเวอร์ชันคอนโซล','toast.conok':'เปิดคอนโซลต้นฉบับแล้ว','toast.logon':'เปิดบันทึกส่วนกลางแล้ว','toast.logoff':'ปิดบันทึกส่วนกลางแล้ว','task.end':'งานสิ้นสุด (โค้ด: {c})','checking':'กำลังตรวจ…','fail':'ตรวจไม่สำเร็จ','hero.free':'พื้นที่ว่างไดรฟ์ C','adv.items':'รายการ'
},
'vi': {
'large.colsize':'Kích thước','large.colpath':'Đường dẫn tệp',
'st.admin.got':'Đã có','st.admin.none':'Chưa có (dọn dẹp có thể chưa đầy đủ)','st.admin.na':'Không áp dụng (chế độ mô phỏng)',
'nav.home':'Trang chủ','nav.quick':'Dọn nhanh','nav.adv':'Dọn nâng cao','nav.disk':'Dung lượng đĩa','nav.large':'Tệp lớn','nav.settings':'Nhật ký & cài đặt','nav.about':'Giới thiệu',
'home.title':'Trang chủ','home.hero.badge':'Kiến trúc neo hoàn toàn mới dựa trên phiên bản cũ','home.hero.h2':'Đưa ổ C trở lại trạng thái tốt nhất','home.hero.p':'Nhẹ, hoàn toàn ngoại tuyến. Kiến trúc neo hoàn toàn mới dựa trên phiên bản cũ, với engine native tốc độ cao.',
'home.btn.quick':'Dọn nhanh một chạm','home.btn.adv':'Dọn nâng cao tùy chỉnh','home.admin':'Quyền quản trị','home.log':'Nhật ký toàn cục','home.cfree':'Ổ C còn trống (tự phát hiện khi khởi động)',
'home.mode':'Chế độ chạy','home.mode.win':'Chế độ Windows: giao diện điều khiển engine dọn dẹp tích hợp để dọn dẹp thực sự. Mọi thứ hoạt động ngay.','home.mode.sim':'Môi trường không phải Windows: mọi tác vụ chỉ mô phỏng luồng giao diện, không dọn thật. Trên Windows sẽ chạy lệnh dọn thật.',
'home.features':'Tất cả tính năng','home.tempwarn':'Chương trình đang chạy từ thư mục tạm: khi dọn tệp tạm, các tệp chương trình đang dùng không thể bị xóa (bảo vệ bình thường). Hãy chuyển EXE đến vị trí cố định (Màn hình nền hoặc D:).',
'fq.n':'Dọn nhanh một chạm','fq.d':'Tự động dọn 9 loại rác phổ biến','fa.n':'Chế độ nâng cao tùy chỉnh','fa.d':'Chọn trong 11 mục, vùng nguy hiểm đánh dấu đỏ','fd.n':'Xem dung lượng đĩa','fd.d':'Nhập ký tự ổ đĩa để xem tổng / đã dùng / trống','fl.n':'Tìm tệp lớn','fl.d':'Engine native tốc độ cao quét đa luồng để định vị tệp lớn',
'quick.title':'Dọn nhanh','quick.sub':'Chạy 9 mục sau theo thứ tự cố định, hoàn toàn tự động.','quick.card':'Dọn nhanh một chạm',
'common.start':'Bắt đầu','common.cancel':'Hủy','common.ready':'Sẵn sàng','common.running':'Đang chạy…','common.done':'Hoàn tất','term.title':'Kết quả',
'adv.title':'Dọn nâng cao','adv.sub':'Chọn từng mục cần dọn.','adv.safe':'Mục tiêu chuẩn (an toàn)','adv.danger':'Vùng nguy hiểm (có thể ảnh hưởng khôi phục hệ thống — cẩn trọng)','adv.exec':'Thực thi','adv.selected':'Đã chọn',
'disk.title':'Dung lượng đĩa','disk.sub':'Nhập ký tự ổ đĩa để xem dung lượng tổng, đã dùng và trống.','disk.query':'Truy vấn','disk.err':'Ký tự ổ đĩa không hợp lệ. Nhập một chữ cái từ A đến Z.','disk.total':'Tổng','disk.used':'Đã dùng','disk.free':'Trống','disk.pct':'Đã dùng {p}%',
'large.title':'Tệp lớn','large.sub':'Quét đa luồng tốc độ cao ổ C:, hiển thị 20 kết quả đầu tiên.','large.label':'Kích thước tối thiểu (GB)','large.scan':'Bắt đầu quét','large.err':'Dữ liệu không hợp lệ. Nhập số (chỉ 0-9 và dấu chấm), ví dụ 1, 2.5 hoặc 0.5.','large.hint':'Nhập 0 để quét mọi tệp (chậm). Có thể hủy bất cứ lúc nào.','large.result':'Kết quả','large.count':'{n} tệp','large.scanning':'Đang quét tốc độ cao…','large.detail':'Đã quét {s} tệp · {m} khớp',
'set.title':'Nhật ký & cài đặt','set.sub':'Logging & Settings','set.log.name':'Nhật ký toàn cục','set.log.desc':'Khi bật, mọi thao tác dọn được ghi vào C:\\Log\\CleanLog.txt (tốn rất ít dung lượng).','set.lang.name':'Ngôn ngữ giao diện','set.lang.desc':'Hỗ trợ 16 ngôn ngữ, áp dụng ngay lập tức.',
'log.refresh':'Làm mới','log.open':'Mở thư mục nhật ký','log.clean':'Nhật ký dọn dẹp CleanLog','log.app':'Nhật ký ứng dụng','log.export':'Xuất nhật ký','log.none':'(Chưa có nhật ký dọn dẹp)',
'about.title':'Giới thiệu','about.impl':'Ghi chú triển khai','about.note1':'Lệnh dọn được lấy từ script gốc từng byte, không chỉnh sửa;','about.note2':'Tìm tệp lớn dùng engine native neo tốc độ cao với quét đa luồng;','about.note3':'Các thao tác nguy hiểm (xóa toàn bộ điểm khôi phục, bộ nhớ đệm bản vá) giữ cảnh báo rõ ràng;','about.note4':'Muốn trải nghiệm gốc, nhấp nút bên dưới để chạy phiên bản console.','about.bat':'Script gốc','about.plat':'Nền tảng','about.repo':'Kho mã gốc','about.ver':'Phiên bản','about.console':'Chạy console gốc (bat)',
'toast.busy':'Đang có tác vụ chạy','toast.empty':'Chọn ít nhất một mục','toast.consim':'Chế độ mô phỏng: chạy trên Windows để mở phiên bản console','toast.conok':'Đã mở console gốc','toast.logon':'Đã bật nhật ký toàn cục','toast.logoff':'Đã tắt nhật ký toàn cục','task.end':'Tác vụ kết thúc (mã: {c})','checking':'Đang kiểm tra…','fail':'Kiểm tra thất bại','hero.free':'Ổ C còn trống','adv.items':'mục'
},
'id': {
'large.colsize':'Ukuran','large.colpath':'Jalur file',
'st.admin.got':'Diperoleh','st.admin.none':'Belum diperoleh (pembersihan mungkin tidak tuntas)','st.admin.na':'T/A (mode simulasi)',
'nav.home':'Beranda','nav.quick':'Pembersihan Cepat','nav.adv':'Pembersihan Lanjutan','nav.disk':'Ruang Disk','nav.large':'File Besar','nav.settings':'Log & Pengaturan','nav.about':'Tentang',
'home.title':'Beranda','home.hero.badge':'Arsitektur neo baru yang dibangun dari versi lama','home.hero.h2':'Kembalikan drive C ke kondisi terbaik','home.hero.p':'Ringan, sepenuhnya offline. Arsitektur neo baru yang dibangun dari versi lama, dengan engine native berkecepatan tinggi.',
'home.btn.quick':'Pembersihan Cepat Sekali Klik','home.btn.adv':'Pembersihan Lanjutan Kustom','home.admin':'Hak administrator','home.log':'Pencatatan global','home.cfree':'Sisa ruang C: (terdeteksi otomatis saat start)',
'home.mode':'Mode operasi','home.mode.win':'Mode Windows: antarmuka menjalankan engine pembersihan terintegrasi untuk pembersihan nyata. Semua langsung berfungsi.','home.mode.sim':'Lingkungan non-Windows: semua tugas hanya mendemokan alur UI dalam mode simulasi tanpa pembersihan nyata. Di Windows, perintah pembersihan nyata dijalankan.',
'home.features':'Semua fitur','home.tempwarn':'Program berjalan dari direktori sementara: saat membersihkan file sementara, file yang sedang dipakai program ini tidak dapat dihapus (perlindungan normal). Pindahkan EXE ke lokasi tetap (Desktop atau D:).',
'fq.n':'Pembersihan Cepat Sekali Klik','fq.d':'Otomatis membersihkan 9 kategori sampah','fa.n':'Mode Lanjutan Kustom','fa.d':'Pilih dari 11 item, zona bahaya ditandai merah','fd.n':'Penampil Ruang Disk','fd.d':'Masukkan huruf drive untuk melihat total / terpakai / kosong','fl.n':'Pencari File Besar','fl.d':'Engine native berkecepatan tinggi dengan pemindaian multithread untuk file besar',
'quick.title':'Pembersihan Cepat','quick.sub':'Menjalankan 9 item berikut dalam urutan tetap, sepenuhnya otomatis.','quick.card':'Pembersihan Cepat Sekali Klik',
'common.start':'Mulai','common.cancel':'Batal','common.ready':'Siap','common.running':'Berjalan…','common.done':'Selesai','term.title':'Keluaran',
'adv.title':'Pembersihan Lanjutan','adv.sub':'Pilih item yang akan dibersihkan satu per satu.','adv.safe':'Item standar (aman)','adv.danger':'Zona bahaya (dapat memengaruhi pemulihan sistem — hati-hati)','adv.exec':'Jalankan','adv.selected':'Terpilih',
'disk.title':'Ruang Disk','disk.sub':'Masukkan huruf drive untuk melihat ruang total, terpakai, dan kosong.','disk.query':'Periksa','disk.err':'Huruf drive tidak valid. Masukkan satu huruf A sampai Z.','disk.total':'Total','disk.used':'Terpakai','disk.free':'Kosong','disk.pct':'{p}% terpakai',
'large.title':'File Besar','large.sub':'Pemindaian multithread cepat drive C:, menampilkan 20 hasil teratas.','large.label':'Ukuran minimum (GB)','large.scan':'Mulai pemindaian','large.err':'Masukan tidak valid. Masukkan angka (hanya 0-9 dan titik), mis. 1, 2.5 atau 0.5.','large.hint':'0 memindai semua file (lambat). Bisa dibatalkan kapan saja.','large.result':'Hasil','large.count':'{n} file','large.scanning':'Pemindaian kecepatan tinggi…','large.detail':'{s} file dipindai · {m} cocok',
'set.title':'Log & Pengaturan','set.sub':'Logging & Settings','set.log.name':'Pencatatan global','set.log.desc':'Jika aktif, semua operasi pembersihan dicatat ke C:\\Log\\CleanLog.txt (sangat hemat ruang).','set.lang.name':'Bahasa antarmuka','set.lang.desc':'Mendukung 16 bahasa, langsung berlaku.',
'log.refresh':'Segarkan','log.open':'Buka folder log','log.clean':'Log pembersihan CleanLog','log.app':'Log aplikasi','log.export':'Ekspor log','log.none':'(Belum ada log pembersihan)',
'about.title':'Tentang','about.impl':'Catatan implementasi','about.note1':'Perintah pembersihan diambil dari skrip asli byte demi byte tanpa perubahan;','about.note2':'Pencarian file besar menggunakan engine native neo berkecepatan tinggi dengan pemindaian multithread;','about.note3':'Operasi berbahaya (menghapus semua restore point, cache patch) mempertahankan peringatan yang jelas;','about.note4':'Untuk pengalaman asli, klik tombol di bawah untuk menjalankan versi konsol.','about.bat':'Skrip asli','about.plat':'Platform','about.repo':'Repositori asli','about.ver':'Versi','about.console':'Jalankan konsol asli (bat)',
'toast.busy':'Sudah ada tugas yang berjalan','toast.empty':'Pilih setidaknya satu item','toast.consim':'Mode simulasi: jalankan di Windows untuk membuka versi konsol','toast.conok':'Konsol asli dijalankan','toast.logon':'Pencatatan global aktif','toast.logoff':'Pencatatan global nonaktif','task.end':'Tugas berakhir (kode: {c})','checking':'Memeriksa…','fail':'Pemeriksaan gagal','hero.free':'Sisa ruang C:','adv.items':'item'
},
};

/* Cleaning item names: translated for major languages, English fallback. */
const ITEM_NAMES = {
  clear_temp:           { 'zh-CN':'临时文件','zh-TW':'暫存檔案','en':'Temporary files','ja':'一時ファイル','ko':'임시 파일','ru':'Временные файлы','fr':'Fichiers temporaires','de':'Temporäre Dateien','es':'Archivos temporales' },
  clear_recycle:        { 'zh-CN':'回收站','zh-TW':'資源回收筒','en':'Recycle Bin','ja':'ごみ箱','ko':'휴지통','ru':'Корзина','fr':'Corbeille','de':'Papierkorb','es':'Papelera' },
  clear_prefetch:       { 'zh-CN':'Prefetch 预读文件','zh-TW':'Prefetch 預先擷取','en':'Prefetch files','ja':'Prefetch ファイル','ko':'Prefetch 파일','ru':'Файлы Prefetch','fr':'Fichiers Prefetch','de':'Prefetch-Dateien','es':'Archivos Prefetch' },
  clear_recent:         { 'zh-CN':'最近文档记录','zh-TW':'最近使用的文件','en':'Recent documents','ja':'最近のドキュメント','ko':'최근 문서','ru':'Недавние документы','fr':'Documents récents','de':'Zuletzt verwendete Dokumente','es':'Documentos recientes' },
  clear_ie_cache:       { 'zh-CN':'IE 缓存','zh-TW':'IE 快取','en':'IE cache','ja':'IE キャッシュ','ko':'IE 캐시','ru':'Кэш IE','fr':'Cache IE','de':'IE-Cache','es':'Caché de IE' },
  clear_logs:           { 'zh-CN':'系统事件日志','zh-TW':'系統事件記錄','en':'System logs','ja':'システムログ','ko':'시스템 로그','ru':'Системные журналы','fr':'Journaux système','de':'Systemprotokolle','es':'Registros del sistema' },
  clear_thumb:          { 'zh-CN':'缩略图缓存','zh-TW':'縮圖快取','en':'Thumbnail cache','ja':'サムネイルキャッシュ','ko':'미리보기 캐시','ru':'Кэш миниатюр','fr':'Cache des miniatures','de':'Miniaturansichten-Cache','es':'Caché de miniaturas' },
  clear_update_cache:   { 'zh-CN':'Windows Update 缓存','zh-TW':'Windows Update 快取','en':'Windows Update cache','ja':'Windows Update キャッシュ','ko':'Windows Update 캐시','ru':'Кэш Windows Update','fr':'Cache Windows Update','de':'Windows-Update-Cache','es':'Caché de Windows Update' },
  clear_browser_cache:  { 'zh-CN':'浏览器缓存','zh-TW':'瀏覽器快取','en':'Browser caches','ja':'ブラウザーキャッシュ','ko':'브라우저 캐시','ru':'Кэш браузеров','fr':'Caches des navigateurs','de':'Browser-Caches','es':'Cachés de navegadores' },
  clear_restore_points: { 'zh-CN':'删除全部系统还原点','zh-TW':'刪除所有系統還原點','en':'Delete ALL restore points','ja':'全復元ポイントの削除','ko':'모든 복원 지점 삭제','ru':'Удалить ВСЕ точки восстановления','fr':'Supprimer TOUS les points de restauration','de':'ALLE Wiederherstellungspunkte löschen','es':'Eliminar TODOS los puntos de restauración' },
  clear_patch_cache:    { 'zh-CN':'补丁缓存','zh-TW':'修補快取','en':'Installer patch cache','ja':'パッチキャッシュ','ko':'패치 캐시','ru':'Кэш исправлений','fr':'Cache de correctifs','de':'Patch-Cache','es':'Caché de parches' },
};

function t(key, params) {
  const lang = (window.__lang || 'zh-CN');
  let s = (I18N[lang] && I18N[lang][key]) || I18N['zh-CN'][key] || key;
  if (params) {
    for (const [k, v] of Object.entries(params)) s = s.split('{' + k + '}').join(v);
  }
  return s;
}

function itemName(fn) {
  const lang = window.__lang || 'zh-CN';
  const m = ITEM_NAMES[fn];
  if (!m) return fn;
  return m[lang] || m['en'] || fn;
}

function applyLang(lang) {
  window.__lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPh);
  });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });
}

function detectSystemLang() {
  const nav = (navigator.language || 'zh-CN').toLowerCase();
  if (nav.startsWith('zh-tw') || nav.startsWith('zh-hk') || nav.startsWith('zh-hant')) return 'zh-TW';
  if (nav.startsWith('zh')) return 'zh-CN';
  const base = nav.split('-')[0];
  for (const code of Object.keys(LANG_NAMES)) {
    if (code.split('-')[0] === base) return code;
  }
  return 'en';
}
