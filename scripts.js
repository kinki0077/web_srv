'use strict';

let fileInput = document.getElementById('csv_file');
let message = document.getElementById('message');
let fileReader = new FileReader();

// ファイル変更時イベント
fileInput.onchange = () => {
  message.innerHTML = "読み込み中..."

  let file = fileInput.files[0];
  fileReader.readAsText(file, "Shift_JIS");
};

// ファイル読み込み時
let items = [];
fileReader.onload = () => {
  // ファイル読み込み
  let fileResult = fileReader.result.split('\r\n');

  // 先頭行をヘッダとして格納
  let header = fileResult[0].split(',')
  // 先頭行の削除
  fileResult.shift();

  // CSVから情報を取得
  items = fileResult.map(item => {
    let datas = item.split(',');
    let result = {};
    for (const index in datas) {
      let key = header[index];
      result[key] = datas[index];
    }
    return result;
  });

  // テーブル初期化
  let tbody = document.querySelector('#csv_data_table tbody');
  tbody.innerHTML = "";

  //　CSVの内容を表示
  let tbody_html = "";
  let i = 1;
  for (let itm of items) {
    tbody_html += `<tr>
        <td id="Tim${String(i).padStart(3,'0')}">${itm.Time}</td>
        <td id="bsN${String(i).padStart(3,'0')}">${itm.BS_Name}</td>
      </tr>
      `
  i++;
  }
  tbody.innerHTML = tbody_html;

  message.innerHTML = items.length + "件のデータを読み込みました。"

  recalc();
 
}

// ファイル読み取り失敗時
fileReader.onerror = () => {
  items = [];
  message.innerHTML = "ファイル読み取りに失敗しました。"
}
// =================  ファイル読み込み終了  ===================

// グローバル変数定義
const offset_length = 160; // 注目行表示時に上からどれだけ離すか
var I = 0; // 何件目のデータか

// 処理メイン
function recalc(){
	const now = new Date();			//現在時刻を取得
	const now_time = parseInt(now.getHours() + String(now.getMinutes()).padStart(2,'0')); // 'YYMM'形式の数字にする
	// header部分に時刻を表示
	const now_str = now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0') + ':' + String(now.getSeconds()).padStart(2,'0');
	document.getElementById('time_display').textContent = now_str;
	
	let i = 1;
	for(let item of items){
		
	    let jikan = item.Time.split(':');
	    let jikan_chr = jikan[0] + String(jikan[1]).padStart(2,'0');
		
		if(jikan_chr === "") continue;

	    let jikan_int = parseInt(jikan_chr);
	    
//		console.log("jikan_chr  = " + jikan_chr);
//		console.log("now_time = " + now_time);

		if(jikan_int > now_time) break;
		i++;
	}

	if(I !== i){
		console.log("i= "+i);
	
		//画面スクロール
//		scrollTo(0,head_length + i*41);
		let Num = String(i).padStart(3,'0');
		ScrollWindow('Tim'+Num);
		//セルの色を変える
		changeColor(i);
		I = i;
	}
	
	refresh();
}

//タイマーセット
function refresh(){
	setTimeout(recalc,1000); //1秒ごとに実行
}

//セルの色を変える
function changeColor(num){
	let Num = "";
	if(I !== 0){
		Num = String(I).padStart(3,'0');
		document.getElementById('Tim'+Num).style.backgroundColor = '#ffffff';
		document.getElementById('bsN'+Num).style.backgroundColor = '#ffffff';
	}

	Num = String(num).padStart(3,'0');
//	console.log("Num= "+Num);
	document.getElementById('Tim'+Num).style.backgroundColor = '#ccffcc';
	document.getElementById('bsN'+Num).style.backgroundColor = '#ccffcc';
}

// 画面スクロール
function ScrollWindow(elem) {
    var element = document.getElementById(elem);
    var rect = element.getBoundingClientRect();
    var elemtop = rect.top + window.pageYOffset - offset_length;
    document.documentElement.scrollTop = elemtop;
  }