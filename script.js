class MathQuestGame {
    constructor() {
        this.playerHp = 100;
        this.monsterHp = 100;
        this.maxMonsterHp = 100; // モンスターの最大HP
        this.score = 0;
        this.stage = 1;
        this.currentAnswer = '';
        this.currentProblem = null;
        this.gameOver = false;
        this.timeLimit = 15; // 制限時間（秒）
        this.currentTime = this.timeLimit;
        this.timerInterval = null;
        this.selectedLevel = null; // 選択されたレベル
        
        // モンスターの種類と絵文字
        this.monsters = [
            { name: 'ドラゴン', emoji: '🐉', color: '#ff6b6b', image: 'teki01.png' },
            { name: 'ゴブリン', emoji: '👹', color: '#ff9a9e', image: 'teki02.png' },
            { name: 'スライム', emoji: '👾', color: '#4ecdc4', image: 'teki01.png' },
            { name: 'オーク', emoji: '👺', color: '#45b7d1', image: 'teki02.png' },
            { name: 'ゴーレム', emoji: '🤖', color: '#96ceb4', image: 'teki01.png' },
            { name: 'ウィッチ', emoji: '🧙‍♀️', color: '#feca57', image: 'teki02.png' },
            { name: 'ミノタウロス', emoji: '🐮', color: '#ff9ff3', image: 'teki01.png' },
            { name: 'フェニックス', emoji: '🦅', color: '#ff6b6b', image: 'teki02.png' }
        ];
        
        // ボスモンスター
        this.midBoss = { name: 'デーモンロード', emoji: '👿', color: '#8b0000', hp: 150, isBoss: true, image: 'boss_dragon01.png' };
        this.stageBoss = { name: 'ドラゴンキング', emoji: '🐲', color: '#ff4500', hp: 200, isBoss: true, image: 'boss_dragon01.png' };
        
        // レベル別設定
        this.levelSettings = {
            beginner: {
                name: 'しょきゅう',
                operations: ['+', '-'],
                maxNumber: 10,
                timeLimit: 20,
                description: 'しょうがく1-2ねんせいむけ'
            },
            intermediate: {
                name: 'ちゅうきゅう',
                operations: ['+', '-', '×'],
                maxNumber: 15,
                timeLimit: 15,
                description: 'しょうがく3-4ねんせいむけ'
            },
            advanced: {
                name: 'じょうきゅう',
                operations: ['+', '-', '×', '÷'],
                maxNumber: 20,
                timeLimit: 12,
                description: 'しょうがく5-6ねんせいむけ'
            }
        };
        
        this.currentMonster = null;
        
        this.setupEventListeners();
    }
    
    initializeGame() {
        if (!this.selectedLevel) {
            return; // レベルが選択されていない場合は何もしない
        }
        this.spawnNewMonster();
        this.generateProblem();
        this.updateUI();
    }
    
    selectLevel(level) {
        this.selectedLevel = level;
        const settings = this.levelSettings[level];
        
        // レベルに応じて設定を調整
        this.timeLimit = settings.timeLimit;
        this.currentTime = this.timeLimit;
        
        // レベル選択画面を非表示
        document.getElementById('levelSelectScreen').style.display = 'none';
        
        // ゲーム画面を表示
        document.getElementById('gameContainer').style.display = 'block';
        
        // ゲーム開始
        this.initializeGame();
    }
    
    spawnNewMonster() {
        // ボス出現判定
        if (this.stage === 5) {
            this.showBossWarning(5, '中ボス');
            return; // 警告画面を表示するため、ここで処理を中断
        } else if (this.stage === 10) {
            this.showBossWarning(10, 'ステージボス');
            return; // 警告画面を表示するため、ここで処理を中断
        } else {
            const randomIndex = Math.floor(Math.random() * this.monsters.length);
            this.currentMonster = this.monsters[randomIndex];
            this.monsterHp = 100;
            this.maxMonsterHp = 100;
            this.updateMessage(`${this.currentMonster.name}があらわれた！さんすうでたおそう！`);
        }
        
        // モンスターの見た目を更新
        this.updateMonsterAppearance();
    }
    
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    generateProblem() {
        if (!this.selectedLevel) {
            return; // レベルが選択されていない場合は何もしない
        }
        const settings = this.levelSettings[this.selectedLevel];
        const operations = settings.operations;
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, num2, answer;
        
        // ボスの場合は特別な難易度
        let maxNumber;
        if (this.currentMonster.isBoss) {
            if (this.currentMonster.name === 'デーモンロード') {
                maxNumber = Math.min(settings.maxNumber + this.stage * 3, settings.maxNumber + 10);
            } else if (this.currentMonster.name === 'ドラゴンキング') {
                maxNumber = Math.min(settings.maxNumber + this.stage * 4, settings.maxNumber + 15);
            }
        } else {
            // ステージに応じて難易度を調整
            maxNumber = Math.min(settings.maxNumber + this.stage * 2, settings.maxNumber + 5);
        }
        
        switch(operation) {
            case '+':
                num1 = Math.floor(Math.random() * maxNumber) + 1;
                num2 = Math.floor(Math.random() * maxNumber) + 1;
                answer = num1 + num2;
                break;
            case '-':
                num1 = Math.floor(Math.random() * maxNumber) + 1;
                num2 = Math.floor(Math.random() * num1) + 1;
                answer = num1 - num2;
                break;
            case '×':
                num1 = Math.floor(Math.random() * Math.min(12, maxNumber)) + 1;
                num2 = Math.floor(Math.random() * Math.min(12, maxNumber)) + 1;
                answer = num1 * num2;
                break;
            case '÷':
                // 割り算は整数になるように調整
                num2 = Math.floor(Math.random() * Math.min(10, maxNumber)) + 1;
                answer = Math.floor(Math.random() * Math.min(10, maxNumber)) + 1;
                num1 = num2 * answer;
                break;
        }
        
        this.currentProblem = {
            num1: num1,
            num2: num2,
            operation: operation,
            answer: answer
        };
        
        // 問題を表示
        const problemDisplay = document.getElementById('problemDisplay');
        problemDisplay.textContent = `${num1} ${operation} ${num2} = ?`;
        
        // 答えをリセット
        this.currentAnswer = '';
        this.updateAnswerDisplay();
        
        // タイマーを開始
        this.startTimer();
    }
    
    updateAnswerDisplay() {
        const answerDisplay = document.getElementById('answerDisplay');
        answerDisplay.textContent = this.currentAnswer || '?';
    }
    
    updateMessage(message) {
        const messageText = document.getElementById('messageText');
        messageText.textContent = message;
    }
    
    startTimer() {
        this.currentTime = this.timeLimit;
        this.updateTimerDisplay();
        
        // 既存のタイマーをクリア
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
            this.currentTime--;
            this.updateTimerDisplay();
            
            if (this.currentTime <= 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    updateTimerDisplay() {
        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) {
            timerDisplay.textContent = this.currentTime;
            
            // 残り時間に応じて色を変更
            if (this.currentTime <= 5) {
                timerDisplay.style.color = '#dc3545'; // 赤
            } else if (this.currentTime <= 10) {
                timerDisplay.style.color = '#ffc107'; // 黄色
            } else {
                timerDisplay.style.color = '#28a745'; // 緑
            }
        }
    }
    
    timeUp() {
        this.stopTimer();
        this.updateMessage(`時間切れ！正解は${this.currentProblem.answer}でした。`);
        
        // 不正解として処理
        setTimeout(() => {
            this.monsterAttack();
        }, 1500);
    }
    
    updateUI() {
        // HPバーの更新
        const monsterHpFill = document.getElementById('monsterHpFill');
        const monsterHpText = document.getElementById('monsterHpText');
        const playerHpFill = document.getElementById('playerHpFill');
        const playerHpText = document.getElementById('playerHpText');
        
        // HPバーの幅を計算（現在HP / 最大HP * 100）
        const monsterHpPercentage = (this.monsterHp / this.maxMonsterHp) * 100;
        monsterHpFill.style.width = `${monsterHpPercentage}%`;
        monsterHpText.textContent = `HP: ${this.monsterHp}/${this.maxMonsterHp}`;
        
        playerHpFill.style.width = `${this.playerHp}%`;
        playerHpText.textContent = `HP: ${this.playerHp}/100`;
        
        // スコアとステージの更新
        document.getElementById('scoreText').textContent = this.score;
        document.getElementById('stageText').textContent = this.stage;
    }
    
    addNumber(number) {
        if (this.gameOver) return;
        
        this.currentAnswer += number.toString();
        this.updateAnswerDisplay();
    }
    
    clearAnswer() {
        if (this.gameOver) return;
        
        this.currentAnswer = '';
        this.updateAnswerDisplay();
    }
    
    attack() {
        if (this.gameOver || !this.currentAnswer) return;
        
        // タイマーを停止
        this.stopTimer();
        
        const playerAnswer = parseInt(this.currentAnswer);
        const correctAnswer = this.currentProblem.answer;
        
        if (playerAnswer === correctAnswer) {
            // 正解の場合
            this.handleCorrectAnswer();
        } else {
            // 不正解の場合
            this.handleWrongAnswer();
        }
        
        // 答えをクリア
        this.currentAnswer = '';
        this.updateAnswerDisplay();
    }
    
    handleCorrectAnswer() {
        // モンスターにダメージを与える
        const damage = 20 + Math.floor(Math.random() * 10);
        this.monsterHp = Math.max(0, this.monsterHp - damage);
        
        // スコアを加算
        this.score += 10;
        
        // 正解エフェクト
        this.showCorrectAnswerEffects(damage);
        
        this.updateMessage(`正解！${this.currentMonster.name}に${damage}ダメージ！`);
        
        // モンスターが倒されたかチェック
        if (this.monsterHp <= 0) {
            this.defeatMonster();
        } else {
            // モンスターが生きている場合は、新しい問題を生成してプレイヤーのターンを継続
            setTimeout(() => {
                this.generateProblem();
                this.updateMessage(`正解！続けて攻撃しよう！`);
            }, 1000);
        }
        
        this.updateUI();
    }
    
    showCorrectAnswerEffects(damage) {
        // 1. モンスターのシェイク
        const monsterImage = document.getElementById('monsterImage');
        monsterImage.classList.add('shake');
        setTimeout(() => monsterImage.classList.remove('shake'), 500);
        
        // 2. 問題表示エリアの正解エフェクト
        const problemDisplay = document.getElementById('problemDisplay');
        problemDisplay.classList.add('correct-answer');
        setTimeout(() => problemDisplay.classList.remove('correct-answer'), 800);
        
        // 3. 答え表示エリアの正解エフェクト
        const answerDisplay = document.getElementById('answerDisplay');
        answerDisplay.classList.add('correct-sound');
        setTimeout(() => answerDisplay.classList.remove('correct-sound'), 500);
        
        // 4. ダメージ数値の表示
        this.showDamageNumber(damage, monsterImage);
    }
    
    showDamageNumber(damage, targetElement) {
        const damageText = document.createElement('div');
        damageText.textContent = `-${damage}`;
        damageText.className = 'damage-number';
        damageText.style.position = 'absolute';
        damageText.style.color = '#ff6b6b';
        damageText.style.fontSize = '1.5em';
        damageText.style.fontWeight = 'bold';
        damageText.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.8)';
        damageText.style.pointerEvents = 'none';
        damageText.style.zIndex = '1000';
        
        // モンスター画像の位置を基準に配置
        const rect = targetElement.getBoundingClientRect();
        const gameContainer = document.querySelector('.game-container');
        const containerRect = gameContainer.getBoundingClientRect();
        
        damageText.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
        damageText.style.top = `${rect.top - containerRect.top}px`;
        
        gameContainer.appendChild(damageText);
        
        // アニメーション
        setTimeout(() => {
            damageText.style.transform = 'translateY(-50px)';
            damageText.style.opacity = '0';
        }, 100);
        
        // 要素を削除
        setTimeout(() => {
            if (damageText.parentNode) {
                damageText.parentNode.removeChild(damageText);
            }
        }, 1000);
    }
    
    handleWrongAnswer() {
        // 不正解エフェクト
        this.showWrongAnswerEffects();
        
        this.updateMessage(`不正解...正解は${this.currentProblem.answer}でした。モンスターの攻撃に備えよう！`);
        
        // モンスターの攻撃ターン
        setTimeout(() => {
            this.monsterAttack();
        }, 2000);
        
        this.updateUI();
    }
    
    showWrongAnswerEffects() {
        // 1. 画面全体のフラッシュ
        const gameContainer = document.querySelector('.game-container');
        gameContainer.classList.add('flash');
        setTimeout(() => gameContainer.classList.remove('flash'), 300);
        
        // 2. 問題表示エリアの赤いフラッシュ
        const problemDisplay = document.getElementById('problemDisplay');
        problemDisplay.classList.add('wrong-answer');
        setTimeout(() => problemDisplay.classList.remove('wrong-answer'), 1000);
        
        // 3. 答え表示エリアのシェイク
        const answerDisplay = document.getElementById('answerDisplay');
        answerDisplay.classList.add('shake');
        setTimeout(() => answerDisplay.classList.remove('shake'), 500);
        
        // 4. 不正解音効果（CSSで実装）
        answerDisplay.classList.add('wrong-sound');
        setTimeout(() => answerDisplay.classList.remove('wrong-sound'), 500);
        
        // 5. モンスターの笑いエフェクト
        const monsterImage = document.getElementById('monsterImage');
        monsterImage.classList.add('laugh');
        setTimeout(() => monsterImage.classList.remove('laugh'), 1000);
    }
    
    monsterAttack() {
        if (this.gameOver) return;
        
        // ボスの場合は特別な攻撃ダメージ
        let baseDamage, damage;
        if (this.currentMonster.isBoss) {
            if (this.currentMonster.name === 'デーモンロード') {
                baseDamage = 20 + this.stage * 3;
                damage = baseDamage + Math.floor(Math.random() * 15);
            } else if (this.currentMonster.name === 'ドラゴンキング') {
                baseDamage = 25 + this.stage * 4;
                damage = baseDamage + Math.floor(Math.random() * 20);
            }
        } else {
            // 通常モンスターの攻撃ダメージを計算（ステージに応じて強くなる）
            baseDamage = 10 + this.stage * 2;
            damage = baseDamage + Math.floor(Math.random() * 10);
        }
        
        this.playerHp = Math.max(0, this.playerHp - damage);
        
        // エフェクト
        const gameContainer = document.querySelector('.game-container');
        gameContainer.classList.add('shake');
        setTimeout(() => gameContainer.classList.remove('shake'), 500);
        
        this.updateMessage(`${this.currentMonster.name}の攻撃！${damage}ダメージを受けた！`);
        
        // プレイヤーが倒されたかチェック
        if (this.playerHp <= 0) {
            this.gameOver = true;
            this.showGameOver(false);
        } else {
            // プレイヤーが生きている場合は、新しい問題を生成
            setTimeout(() => {
                this.generateProblem();
                this.updateMessage(`新しい問題だ！頑張って解こう！`);
            }, 1500);
        }
        
        this.updateUI();
    }
    
    defeatMonster() {
        let bonusScore = 50;
        let message = `${this.currentMonster.name}を倒した！ステージ${this.stage + 1}に進む！`;
        
        // ボス撃破時の特別な処理
        if (this.currentMonster.isBoss) {
            if (this.currentMonster.name === 'デーモンロード') {
                bonusScore = 200;
                message = `中ボス ${this.currentMonster.name}を倒した！\n特別ボーナス獲得！ステージ${this.stage + 1}に進む！`;
            } else if (this.currentMonster.name === 'ドラゴンキング') {
                bonusScore = 500;
                message = `ステージボス ${this.currentMonster.name}を倒した！\n大ボーナス獲得！おめでとう！`;
            }
        }
        
        this.score += bonusScore;
        this.stage++;
        
        this.updateMessage(message);
        
        // 少し待ってから新しいモンスターを出現
        setTimeout(() => {
            this.spawnNewMonster();
            this.generateProblem();
            this.updateUI();
        }, 3000);
    }
    
    showGameOver(won) {
        const gameOverScreen = document.getElementById('gameOverScreen');
        const gameOverTitle = document.getElementById('gameOverTitle');
        const gameOverMessage = document.getElementById('gameOverMessage');
        
        if (won) {
            gameOverTitle.textContent = 'クリア！';
            gameOverTitle.style.color = '#28a745';
            gameOverMessage.textContent = `おめでとう！ステージ${this.stage}までクリアしたよ！スコア: ${this.score}`;
        } else {
            gameOverTitle.textContent = 'ゲームオーバー';
            gameOverTitle.style.color = '#dc3545';
            gameOverMessage.textContent = `がんばったね！スコア: ${this.score}`;
        }
        
        gameOverScreen.style.display = 'flex';
    }
    
    restartGame() {
        this.playerHp = 100;
        this.monsterHp = 100;
        this.maxMonsterHp = 100;
        this.score = 0;
        this.stage = 1;
        this.currentAnswer = '';
        this.gameOver = false;
        this.currentTime = this.timeLimit;
        
        // タイマーを停止
        this.stopTimer();
        
        document.getElementById('gameOverScreen').style.display = 'none';
        
        this.initializeGame();
    }
    
    showQuitConfirm() {
        // 現在のスコアを表示
        document.getElementById('currentScore').textContent = this.score;
        
        // 確認画面を表示
        document.getElementById('quitConfirmScreen').style.display = 'flex';
        
        // ゲームを一時停止
        this.gameOver = true;
        this.stopTimer();
    }
    
    hideQuitConfirm() {
        // 確認画面を非表示
        document.getElementById('quitConfirmScreen').style.display = 'none';
        
        // ゲームを再開
        this.gameOver = false;
        this.startTimer();
    }
    
    quitGame() {
        // ゲーム終了メッセージを表示
        alert(`ゲームしゅうりょう！\nさいしゅうスコア: ${this.score}\nステージ: ${this.stage}\nおつかれさまでした！`);
        
        // レベル選択画面に戻る
        this.showLevelSelect();
    }
    
    showBossWarning(stage, bossType) {
        // 警告画面の要素を更新
        document.getElementById('bossWarningStage').textContent = stage;
        document.getElementById('bossWarningTitle').textContent = `${bossType}せんけいこく`;
        
        if (bossType === '中ボス') {
            document.getElementById('bossWarningMessage').textContent = 'きょうりょくなちゅうボスがあらわれようとしています！';
        } else {
            document.getElementById('bossWarningMessage').textContent = 'さいきょうのステージボスがあらわれようとしています！';
        }
        
        // 警告画面を表示
        document.getElementById('bossWarningScreen').style.display = 'flex';
    }
    
    hideBossWarning() {
        document.getElementById('bossWarningScreen').style.display = 'none';
    }
    
    startBossBattle(stage) {
        this.hideBossWarning();
        
        // ボス戦を開始
        if (stage === 5) {
            this.currentMonster = this.midBoss;
            this.monsterHp = this.midBoss.hp;
            this.maxMonsterHp = this.midBoss.hp;
            this.updateMessage(`ちゅうボス ${this.currentMonster.name}があらわれた！きをつけろ！`);
        } else if (stage === 10) {
            this.currentMonster = this.stageBoss;
            this.monsterHp = this.stageBoss.hp;
            this.maxMonsterHp = this.stageBoss.hp;
            this.updateMessage(`ステージボス ${this.currentMonster.name}があらわれた！けっせんだ！`);
        }
        
        // ボスフラグを確実に設定
        this.currentMonster.isBoss = true;
        
        // モンスターの見た目を更新
        this.updateMonsterAppearance();
        
        // 問題を生成
        this.generateProblem();
        
        // UIを更新
        this.updateUI();
    }
    
    updateMonsterAppearance() {
        const monsterImage = document.getElementById('monsterImage');
        const monsterPlaceholder = monsterImage.querySelector('.monster-placeholder');
        
        // 画像がある場合は画像を表示、ない場合は絵文字を表示
        if (this.currentMonster.image) {
            monsterPlaceholder.innerHTML = `<img src="images/${this.currentMonster.image}" alt="${this.currentMonster.name}" style="width: 100%; height: 100%; object-fit: contain;">`;
        } else {
            monsterPlaceholder.textContent = this.currentMonster.emoji;
        }
        
        // 背景をステージとレベルに応じて設定
        const gameContainer = document.getElementById('gameContainer');
        let backgroundImage = 'back.png';
        
        // ステージ5と10の場合はボス背景をランダムに選択
        if (this.stage === 5 || this.stage === 10) {
            const bossBackgrounds = ['back_boss01.png', 'back_boss02.png'];
            backgroundImage = bossBackgrounds[Math.floor(Math.random() * bossBackgrounds.length)];
        }
        // 初級のステージ6以降はback02.pngを使用（ステージ5と10以外）
        else if (this.selectedLevel === 'beginner' && this.stage >= 6) {
            backgroundImage = 'back02.png';
        }
        
        // スマホ画面の背景も更新（!importantで強制設定）
        gameContainer.style.setProperty('background-image', `url('./images/${backgroundImage}')`, 'important');
        gameContainer.style.setProperty('background-repeat', 'no-repeat', 'important');
        gameContainer.style.setProperty('background-position', 'center center', 'important');
        gameContainer.style.setProperty('background-size', 'cover', 'important');
        
        // デバッグ用ログ
        console.log('背景画像設定:', {
            stage: this.stage,
            isBoss: this.currentMonster.isBoss,
            backgroundImage: backgroundImage,
            gameContainerBackground: gameContainer.style.backgroundImage
        });
        
        // ボスの場合は特別なエフェクト
        if (this.currentMonster.isBoss) {
            monsterImage.style.backgroundImage = `url('./images/${backgroundImage}')`;
            monsterImage.style.backgroundRepeat = 'no-repeat';
            monsterImage.style.backgroundPosition = 'center center';
            monsterImage.style.backgroundSize = 'cover';
            monsterImage.style.border = '4px solid #ffd700';
            monsterImage.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
            monsterImage.classList.add('boss');
            gameContainer.classList.add('boss-battle');
        } else {
            monsterImage.style.backgroundImage = `url('./images/${backgroundImage}')`;
            monsterImage.style.backgroundRepeat = 'no-repeat';
            monsterImage.style.backgroundPosition = 'center center';
            monsterImage.style.backgroundSize = 'cover';
            monsterImage.style.border = '4px solid #f7fafc';
            monsterImage.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
            monsterImage.classList.remove('boss');
            gameContainer.classList.remove('boss-battle');
        }
    }
    
    showLevelSelect() {
        // ゲーム画面を非表示
        document.getElementById('gameContainer').style.display = 'none';
        
        // レベル選択画面を表示
        document.getElementById('levelSelectScreen').style.display = 'flex';
        
        // ゲーム状態をリセット（レベル選択は保持）
        this.playerHp = 100;
        this.monsterHp = 100;
        this.maxMonsterHp = 100;
        this.score = 0;
        this.stage = 1;
        this.currentAnswer = '';
        this.gameOver = false;
        this.currentTime = this.timeLimit;
        this.selectedLevel = null; // レベル選択をリセット
        
        // タイマーを停止
        this.stopTimer();
        
        // ゲームオーバー画面を非表示
        document.getElementById('gameOverScreen').style.display = 'none';
        document.getElementById('quitConfirmScreen').style.display = 'none';
    }
    
    setupEventListeners() {
        // 数字ボタンのイベントリスナー
        const numberButtons = document.querySelectorAll('.number-btn');
        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                const number = parseInt(button.dataset.number);
                this.addNumber(number);
            });
        });
        
        // クリアボタン
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearAnswer();
        });
        
        // 攻撃ボタン
        document.getElementById('attackBtn').addEventListener('click', () => {
            this.attack();
        });
        
        // リスタートボタン
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartGame();
        });
        
        // ゲーム終了ボタン
        document.getElementById('quitBtn').addEventListener('click', () => {
            this.showQuitConfirm();
        });
        
        // キャンセルボタン
        document.getElementById('cancelQuitBtn').addEventListener('click', () => {
            this.hideQuitConfirm();
        });
        
        // 確認終了ボタン
        document.getElementById('confirmQuitBtn').addEventListener('click', () => {
            this.quitGame();
        });
        
        // レベル選択ボタン
        document.getElementById('beginnerBtn').addEventListener('click', () => {
            this.selectLevel('beginner');
        });
        
        document.getElementById('intermediateBtn').addEventListener('click', () => {
            this.selectLevel('intermediate');
        });
        
        document.getElementById('advancedBtn').addEventListener('click', () => {
            this.selectLevel('advanced');
        });
        
        // ボス戦警告画面のボタン
        document.getElementById('bossWarningBtn').addEventListener('click', () => {
            const stage = parseInt(document.getElementById('bossWarningStage').textContent);
            this.startBossBattle(stage);
        });
        
        // キーボード入力
        document.addEventListener('keydown', (event) => {
            if (this.gameOver) return;
            
            if (event.key >= '0' && event.key <= '9') {
                this.addNumber(parseInt(event.key));
            } else if (event.key === 'Enter') {
                this.attack();
            } else if (event.key === 'Backspace' || event.key === 'Delete') {
                this.clearAnswer();
            }
        });
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    const game = new MathQuestGame();
    
    // レベル選択画面を表示
    document.getElementById('levelSelectScreen').style.display = 'flex';
    document.getElementById('gameContainer').style.display = 'none';
}); 