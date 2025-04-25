let radio;
let submitButton;
let result = "";
let table;
let question = "";
let options = [];
let correctAnswer = "";
let currentQuestionIndex = 0;
let correctCount = 0;
let incorrectCount = 0;

function preload() {
  // 載入 CSV 檔案
  table = loadTable('question.csv', 'csv', 'header', onLoad, onError);
}

function onLoad() {
  loadQuestion(currentQuestionIndex);
}

function onError() {
  console.error("Failed to load question.csv");
}

function setup() {
  //產生一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);
  //設定背景色
  background("#bbd0ff");

  // 設定選項
  radio = createRadio();
  radio.style('width', '200px');
  radio.style('font-size', '35px');
  radio.style('color', '#003566');

  // 設定送出按鈕
  submitButton = createButton('下一題');
  submitButton.style('font-size', '24px');
  submitButton.style('padding', '10px 20px');
  submitButton.mousePressed(nextQuestion);

  // 確保在初始化後載入第一題
  if (table) {
    loadQuestion(currentQuestionIndex);
  }
}

function draw() {
  background("#bbd0ff");
  // 設定矩形顏色
  fill("#ffd6ff");
  // 在視窗中間繪製矩形
  rect(windowWidth / 4, windowHeight / 4, windowWidth / 2, windowHeight / 2);

  // 顯示題目
  fill("#000000");
  textSize(36);
  textAlign(CENTER);
  text(question, windowWidth / 2, windowHeight / 2 - 100);

  // 設定選項位置，兩個一行
  const radioX = windowWidth / 2 - 150;
  const radioY = windowHeight / 2 - 50;
  for (let i = 0; i < radio.elt.children.length; i++) {
    const option = radio.elt.children[i];
    option.style.position = 'absolute';
    option.style.left = `${radioX + (i % 2) * 150}px`;
    option.style.top = `${radioY + Math.floor(i / 2) * 40}px`;
  }

  // 設定送出按鈕位置，往下移
  submitButton.position(windowWidth / 2 - 60, windowHeight / 2 + 100);

  // 顯示結果
  textSize(24);
  text(result, windowWidth / 2, windowHeight / 2 + 200);
}

function windowResized() {
  // 調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
}

function loadQuestion(index) {
  let row = table.getRow(index);
  question = row.get('question');
  options = [row.get('option1'), row.get('option2'), row.get('option3'), row.get('option4')];
  correctAnswer = row.get('correct');

  // 確保 radio 已初始化後再設定選項
  if (radio) {
    radio.elt.innerHTML = ''; // 清空選項
    for (let i = 0; i < options.length; i++) {
      radio.option(options[i]);
    }
  }
}

function nextQuestion() {
  if (radio.value() === correctAnswer) {
    correctCount++;
  } else {
    incorrectCount++;
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < table.getRowCount()) {
    loadQuestion(currentQuestionIndex);
  } else {
    result = `答對了 ${correctCount} 題，答錯了 ${incorrectCount} 題`;
    submitButton.html('再試一次');
    submitButton.mousePressed(restartQuiz);
  }
}

function restartQuiz() {
  currentQuestionIndex = 0;
  correctCount = 0;
  incorrectCount = 0;
  result = "";
  submitButton.html('下一題');
  submitButton.mousePressed(nextQuestion);
  loadQuestion(currentQuestionIndex);
}