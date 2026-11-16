// ===== MENU MOBILE =====
const menuToggle = document.querySelector("#menuToggle");
const navigation = document.querySelector("#navigation");

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "×" : "☰";
});

navigation.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

// ===== CALCULADORA DE JUROS =====
const calculatorForm = document.querySelector("#calculatorForm");
const money = value => value.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL"
});

calculatorForm.addEventListener("submit", event => {
  event.preventDefault();

  const type = document.querySelector("#interestType").value;
  const capital = Number(document.querySelector("#capital").value);
  const ratePercent = Number(document.querySelector("#rate").value);
  const period = Number(document.querySelector("#period").value);
  const unit = document.querySelector("#periodUnit").value;

  if (!Number.isFinite(capital) || !Number.isFinite(ratePercent) ||
      !Number.isFinite(period) || capital <= 0 || ratePercent < 0 || period < 0) {
    alert("Confira os valores informados. O capital deve ser maior que zero e taxa e período não podem ser negativos.");
    return;
  }

  const rate = ratePercent / 100;
  let amount;
  let explanation;

  if (type === "simple") {
    const interest = capital * rate * period;
    amount = capital + interest;
    explanation = `Juros simples: ${money(interest)} de juros. O acréscimo foi calculado sempre sobre o capital inicial.`;
  } else {
    amount = capital * Math.pow(1 + rate, period);
    const interest = amount - capital;
    explanation = `Juros compostos: ${money(interest)} de juros. A cada período, os juros são incorporados ao saldo.`;
  }

  const totalInterest = amount - capital;
  document.querySelector("#amountResult").textContent = money(amount);
  document.querySelector("#capitalResult").textContent = money(capital);
  document.querySelector("#interestResult").textContent = money(totalInterest);
  document.querySelector("#modelResult").textContent =
    type === "simple" ? "Juros simples" : "Juros compostos";
  document.querySelector("#calculatorExplanation").textContent =
    `${explanation} Taxa: ${ratePercent}% ao ${unit === "m" ? "mês" : "ano"}; período: ${period} ${unit === "m" ? "meses" : "anos"}.`;
});

// ===== QUIZ INTERATIVO =====
const questions = [
  {
    question: "O que representa o capital em uma operação financeira?",
    options: [
      "O valor inicial aplicado ou emprestado.",
      "Apenas o valor dos juros.",
      "O valor final depois dos acréscimos.",
      "A porcentagem cobrada por período."
    ],
    correct: 0,
    explanation: "Isso mesmo! Capital (C) é o valor inicial da operação, antes da incidência dos juros."
  },
  {
    question: "Uma taxa de 5% escrita na forma decimal corresponde a:",
    options: ["0,5", "0,05", "5,0", "0,005"],
    correct: 1,
    explanation: "Para transformar porcentagem em decimal, dividimos por 100: 5 ÷ 100 = 0,05."
  },
  {
    question: "Nos juros simples, os juros de cada período são calculados sobre:",
    options: ["O montante do período anterior.", "A taxa acumulada.", "O capital inicial.", "O dobro do capital."],
    correct: 2,
    explanation: "Correto! Nos juros simples, a base de cálculo permanece sendo o capital inicial."
  },
  {
    question: "Um produto custa R$ 300 à vista ou 3 parcelas de R$ 110. Qual é o total parcelado?",
    options: ["R$ 310", "R$ 320", "R$ 330", "R$ 340"],
    correct: 2,
    explanation: "Multiplicamos o número de parcelas pelo valor de cada uma: 3 × 110 = R$ 330."
  },
  {
    question: "Uma taxa é de 2% ao mês durante 6 meses. Para usar a fórmula diretamente, o tempo deve ser informado em:",
    options: ["Dias.", "Meses.", "Anos.", "Qualquer unidade, sem conversão."],
    correct: 1,
    explanation: "Taxa e tempo devem estar na mesma unidade. Como a taxa é mensal, o período deve estar em meses."
  }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const questionProgress = document.querySelector("#questionProgress");
const scoreProgress = document.querySelector("#scoreProgress");
const progressBar = document.querySelector("#progressBar");
const quizQuestion = document.querySelector("#quizQuestion");
const quizOptions = document.querySelector("#quizOptions");
const quizFeedback = document.querySelector("#quizFeedback");
const nextQuestion = document.querySelector("#nextQuestion");
const quizContent = document.querySelector("#quizContent");
const quizResult = document.querySelector("#quizResult");

function renderQuestion() {
  const item = questions[currentQuestion];
  answered = false;

  questionProgress.textContent = `PERGUNTA ${currentQuestion + 1} DE ${questions.length}`;
  scoreProgress.textContent = `${score} ${score === 1 ? "acerto" : "acertos"}`;
  progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;
  quizQuestion.textContent = item.question;
  quizOptions.innerHTML = "";
  quizFeedback.textContent = "";
  quizFeedback.className = "quiz-feedback";
  nextQuestion.disabled = true;
  nextQuestion.textContent = currentQuestion === questions.length - 1
    ? "Ver resultado →"
    : "Próxima pergunta →";

  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span><span></span>`;
    button.querySelector("span:last-child").textContent = option;
    button.addEventListener("click", () => selectAnswer(index));
    quizOptions.appendChild(button);
  });
}

function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;

  const item = questions[currentQuestion];
  const buttons = [...quizOptions.querySelectorAll("button")];
  const isCorrect = selectedIndex === item.correct;

  if (isCorrect) score++;

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.correct) button.classList.add("correct");
    if (index === selectedIndex && !isCorrect) button.classList.add("incorrect");
  });

  quizFeedback.textContent = `${isCorrect ? "Resposta correta! " : "Não foi dessa vez. "} ${item.explanation}`;
  quizFeedback.classList.add("visible", isCorrect ? "good" : "bad");
  scoreProgress.textContent = `${score} ${score === 1 ? "acerto" : "acertos"}`;
  nextQuestion.disabled = false;
}

nextQuestion.addEventListener("click", () => {
  if (!answered) return;

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showQuizResult();
  }
});

function showQuizResult() {
  quizContent.hidden = true;
  quizResult.hidden = false;
  progressBar.style.width = "100%";
  document.querySelector("#finalScore").textContent =
    `Você acertou ${score} de ${questions.length} questões.`;
  let message;
  if (score === questions.length) {
    message = "Excelente! Você demonstrou domínio dos conceitos desta revisão.";
  } else if (score >= 3) {
    message = "Muito bem! Revise os comentários das questões para fortalecer o aprendizado.";
  } else {
    message = "Continue praticando! Releia os conceitos e tente novamente. Errar faz parte do aprendizado.";
  }
  document.querySelector("#finalMessage").textContent = message;
}

document.querySelector("#restartQuiz").addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  quizContent.hidden = false;
  quizResult.hidden = true;
  renderQuestion();
});

// Inicializa o quiz e a calculadora com os valores de exemplo.
renderQuestion();
calculatorForm.dispatchEvent(new Event("submit", { cancelable: true }));
