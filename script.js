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
        
        // 初級レベルのモンスター
        this.beginnerMonsters = [
            { name: 'イチメドン', emoji: '🐉', color: '#ff6b6b', image: 'teki01.png' },
            { name: 'ウルフ', emoji: '🐺', color: '#ff9a9e', image: 'teki02.png' },
            { name: 'フェニックス', emoji: '🦅', color: '#4ecdc4', image: 'teki03.png' },
            { name: 'グリズリー', emoji: '🐻', color: '#a0522d', image: 'teki04.png' },
            { name: 'ゴルドナイト', emoji: '⚔️', color: '#ffd700', image: 'teki05.png' },
            { name: 'ナイトウィザード', emoji: '🧙‍♂️', color: '#9b59b6', image: 'teki06.png' },
            { name: 'ボーンウォーリア', emoji: '🦴', color: '#8b4513', image: 'teki07.png' },
            { name: 'おばけキノコ', emoji: '🍄', color: '#e74c3c', image: 'teki08.png' },
            { name: 'バルガード', emoji: '🛡️', color: '#2c3e50', image: 'teki09.png' }
        ];
        
        // 中級レベルのモンスター
        this.intermediateMonsters = [
            { name: 'ゲルイーカ', emoji: '🦑', color: '#8e44ad', image: 'teki_stage2_01.png' },
            { name: 'クジランテ', emoji: '🐋', color: '#3498db', image: 'teki_stage2_02.png' },
            { name: 'ゲコロス', emoji: '🦎', color: '#27ae60', image: 'teki_stage2_03.png' },
            { name: 'ガメドラス', emoji: '🐢', color: '#16a085', image: 'teki_stage2_04.png' },
            { name: 'シーヴァイパー', emoji: '🐍', color: '#e67e22', image: 'teki_stage2_05.png' },
            { name: 'デスジョーズ', emoji: '🦈', color: '#2c3e50', image: 'teki_stage2_06.png' },
            { name: 'スミバクダン', emoji: '💣', color: '#e74c3c', image: 'teki_stage2_07.png' },
            { name: 'アビスロード', emoji: '👹', color: '#9b59b6', image: 'teki_stage2_08.png' }
        ];
        
        // 上級レベルのモンスター
        this.advancedMonsters = [
            { name: 'イフリートン', emoji: '🔥', color: '#ff4500', image: 'teki_stage3_01.png' },
            { name: 'バルグロス', emoji: '🦖', color: '#8b0000', image: 'teki_stage3_02.png' },
            { name: 'ダグマール', emoji: '⚔️', color: '#4a4a4a', image: 'teki_stage3_03.png' },
            { name: 'ゴルゴラン', emoji: '🦍', color: '#654321', image: 'teki_stage3_04.png' },
            { name: 'メタルザイガス', emoji: '🤖', color: '#c0c0c0', image: 'teki_stage3_05.png' },
            { name: 'メドゥローザ', emoji: '🌹', color: '#ff1493', image: 'teki_stage3_06.png' },
            { name: 'シャドーホーン', emoji: '🦄', color: '#4b0082', image: 'teki_stage3_07.png' },
            { name: 'じごくのまどうし', emoji: '👹', color: '#8b0000', image: 'teki_stage3_08.png' }
        ];
        
        // 現在のレベルに応じたモンスター配列を設定
        this.monsters = this.beginnerMonsters;
        
        // ボスモンスター
        this.beginnerMidBoss = { name: 'ダークドラゴン', emoji: '🐲', color: '#8b0000', hp: 150, isBoss: true, image: 'boss_dragon01.png' };
        this.intermediateMidBoss = { name: 'クラーゲン', emoji: '👿', color: '#8b0000', hp: 150, isBoss: true, image: 'boss_stage2_01.png' };
        this.intermediateStageBoss = { name: 'ヴォルグレイド', emoji: '🐲', color: '#ff4500', hp: 200, isBoss: true, image: 'boss_stage2_02.png' };
        this.advancedStageBoss = { name: 'フレイムデーモン', emoji: '🔥', color: '#ff4500', hp: 250, isBoss: true, image: 'boss_stage3_01.png' };
        this.advancedFinalBoss = { name: 'グランギルドラ', emoji: '🐲', color: '#8b0000', hp: 300, isBoss: true, image: 'boss_stage3_02.png' };
        this.advancedEvolvedBoss = { name: 'カオスギガドラ', emoji: '🐲', color: '#800080', hp: 400, isBoss: true, image: 'boss_stage3_03.png' };
        this.stageBoss = { name: 'まおう', emoji: '🐲', color: '#ff4500', hp: 200, isBoss: true, image: 'boss_maou.png' };
        
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
        this.usedMonsters = []; // 使用済みモンスターを管理する配列
        this.lastProblem = null; // 前回の問題を記録
        this.advancedBossEvolved = false; // 上級ボスの進化フラグ

        
        this.setupEventListeners();
    }
    
    initializeGame() {
        if (!this.selectedLevel) {
            return; // レベルが選択されていない場合は何もしない
        }
        
        // デバッグログ
        console.log('ゲーム初期化:', {
            selectedLevel: this.selectedLevel,
            stage: this.stage
        });
        
        this.spawnNewMonster();
        this.generateProblem();
        this.updateUI();
    }
    
    selectLevel(level) {
        this.selectedLevel = level;
        const settings = this.levelSettings[level];
        
        // レベルに応じてモンスター配列を設定
        if (level === 'beginner') {
            this.monsters = this.beginnerMonsters;
        } else if (level === 'intermediate') {
            this.monsters = this.intermediateMonsters;
        } else if (level === 'advanced') {
            this.monsters = this.advancedMonsters;
        }
        
        // 使用済みモンスターリストをリセット
        this.usedMonsters = [];
        
        // デバッグログ
        console.log('レベル選択:', {
            selectedLevel: this.selectedLevel,
            level: level,
            settings: settings,
            monsters: this.monsters
        });
        
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
            // 使用済みでないモンスターを取得
            const availableMonsters = this.monsters.filter(monster => 
                !this.usedMonsters.includes(monster.name)
            );
            
            // すべてのモンスターが使用済みの場合はリセット
            if (availableMonsters.length === 0) {
                this.usedMonsters = [];
                availableMonsters.push(...this.monsters);
            }
            
            // ランダムにモンスターを選択
            const randomIndex = Math.floor(Math.random() * availableMonsters.length);
            this.currentMonster = availableMonsters[randomIndex];
            
            // 使用済みリストに追加
            this.usedMonsters.push(this.currentMonster.name);
            
            this.monsterHp = 100;
            this.maxMonsterHp = 100;
            this.updateMessage(`${this.currentMonster.name}があらわれた！`);
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
        
        let num1, num2, answer, operation;
        let attempts = 0;
        const maxAttempts = 50; // 最大試行回数
        
        do {
            operation = operations[Math.floor(Math.random() * operations.length)];
            
            // ボスの場合は特別な難易度
            let maxNumber;
            if (this.currentMonster.isBoss) {
                if (this.currentMonster.name === 'ダークドラゴン') {
                    maxNumber = Math.min(settings.maxNumber + this.stage * 3, settings.maxNumber + 10);
                } else if (this.currentMonster.name === 'クラーゲン') {
                    maxNumber = Math.min(settings.maxNumber + this.stage * 3, settings.maxNumber + 10);
                            } else if (this.currentMonster.name === 'フレイムデーモン') {
                maxNumber = Math.min(settings.maxNumber + this.stage * 3, settings.maxNumber + 12);
                            } else if (this.currentMonster.name === 'グランギルドラ') {
                maxNumber = Math.min(settings.maxNumber + this.stage * 5, settings.maxNumber + 20);
            } else if (this.currentMonster.name === 'カオスギガドラ') {
                maxNumber = Math.min(settings.maxNumber + this.stage * 6, settings.maxNumber + 25);
                } else if (this.currentMonster.name === 'ヴォルグレイド') {
                    maxNumber = Math.min(settings.maxNumber + this.stage * 4, settings.maxNumber + 15);
                } else if (this.currentMonster.name === 'まおう') {
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
            
            attempts++;
            
            // 前回の問題と同じでないかチェック
            if (this.lastProblem && 
                this.lastProblem.num1 === num1 && 
                this.lastProblem.num2 === num2 && 
                this.lastProblem.operation === operation) {
                continue; // 同じ問題の場合は再試行
            }
            
            break; // 異なる問題が見つかったらループを抜ける
            
        } while (attempts < maxAttempts);
        
        this.currentProblem = {
            num1: num1,
            num2: num2,
            operation: operation,
            answer: answer
        };
        
        // 前回の問題として記録
        this.lastProblem = {
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
            if (this.currentMonster.name === 'ダークドラゴン') {
                baseDamage = 20 + this.stage * 3;
                damage = baseDamage + Math.floor(Math.random() * 15);
            } else if (this.currentMonster.name === 'クラーゲン') {
                baseDamage = 20 + this.stage * 3;
                damage = baseDamage + Math.floor(Math.random() * 15);
            } else if (this.currentMonster.name === 'フレイムデーモン') {
                baseDamage = 20 + this.stage * 3;
                damage = baseDamage + Math.floor(Math.random() * 15);
            } else if (this.currentMonster.name === 'グランギルドラ') {
                baseDamage = 30 + this.stage * 5;
                damage = baseDamage + Math.floor(Math.random() * 25);
            } else if (this.currentMonster.name === 'カオスギガドラ') {
                baseDamage = 35 + this.stage * 6;
                damage = baseDamage + Math.floor(Math.random() * 30);
            } else if (this.currentMonster.name === 'ヴォルグレイド') {
                baseDamage = 25 + this.stage * 4;
                damage = baseDamage + Math.floor(Math.random() * 20);
            } else if (this.currentMonster.name === 'まおう') {
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
            if (this.currentMonster.name === 'ダークドラゴン') {
                bonusScore = 200;
                message = `中ボス ${this.currentMonster.name}を倒した！\n特別ボーナス獲得！ステージ${this.stage + 1}に進む！`;
            } else if (this.currentMonster.name === 'クラーゲン') {
                bonusScore = 200;
                message = `中ボス ${this.currentMonster.name}を倒した！\n特別ボーナス獲得！ステージ${this.stage + 1}に進む！`;
            } else if (this.currentMonster.name === 'ヴォルグレイド') {
                bonusScore = 500;
                message = `ステージボス ${this.currentMonster.name}を倒した！\n大ボーナス獲得！おめでとう！`;
            } else if (this.currentMonster.name === 'フレイムデーモン') {
                bonusScore = 300;
                message = `中ボス ${this.currentMonster.name}を倒した！\n特別ボーナス獲得！ステージ${this.stage + 1}に進む！`;
            } else if (this.currentMonster.name === 'グランギルドラ') {
                if (this.selectedLevel === 'advanced' && this.stage === 10 && !this.advancedBossEvolved) {
                    // 上級ステージ10のグランギルドラを倒した場合、進化する
                    bonusScore = 500;
                    message = `最終ボス ${this.currentMonster.name}を倒した！\nしかし、${this.currentMonster.name}は進化した！`;
                    this.advancedBossEvolved = true;
                } else {
                    bonusScore = 1000;
                    message = `最終ボス ${this.currentMonster.name}を倒した！\n伝説のボーナス獲得！おめでとう！`;
                }
            } else if (this.currentMonster.name === 'カオスギガドラ') {
                bonusScore = 2000;
                message = `真の最終ボス ${this.currentMonster.name}を倒した！\n究極のボーナス獲得！おめでとう！`;
            } else if (this.currentMonster.name === 'まおう') {
                bonusScore = 500;
                message = `ステージボス ${this.currentMonster.name}を倒した！\n大ボーナス獲得！おめでとう！`;
            }
        }
        
        this.score += bonusScore;
        
        // ステージ10のボスを倒した場合はゲームクリア
        if (this.currentMonster.name === 'まおう' || this.currentMonster.name === 'ヴォルグレイド' || 
            (this.currentMonster.name === 'グランギルドラ' && this.selectedLevel !== 'advanced') ||
            this.currentMonster.name === 'カオスギガドラ') {
            this.updateMessage(message);
            setTimeout(() => {
                this.showGameOver(true); // ゲームクリア
            }, 2000);
        } else {
            // 上級ステージ10でグランギルドラを倒して進化した場合
            if (this.selectedLevel === 'advanced' && this.stage === 10 && this.advancedBossEvolved && this.currentMonster.name === 'グランギルドラ') {
                this.updateMessage(message);
                setTimeout(() => {
                    this.showEvolutionEffect();
                }, 1000);
            } else {
                this.stage++;
                this.updateMessage(message);
                
                // 少し待ってから新しいモンスターを出現
                setTimeout(() => {
                    this.spawnNewMonster();
                    this.generateProblem();
                    this.updateUI();
                }, 3000);
            }
        }
    }
    
    showGameOver(won) {
        const gameOverScreen = document.getElementById('gameOverScreen');
        const gameOverTitle = document.getElementById('gameOverTitle');
        const gameOverMessage = document.getElementById('gameOverMessage');
        const gameOverButtons = document.getElementById('gameOverButtons');
        
        if (won) {
            gameOverTitle.textContent = 'クリア！';
            gameOverTitle.style.color = '#28a745';
            gameOverMessage.textContent = `おめでとう！ステージ${this.stage}までクリアしたよ！スコア: ${this.score}`;
            
            // ステージ10クリア時は特別な選択肢を表示
            if (this.stage === 10) {
                gameOverButtons.innerHTML = `
                    <button class="restart-btn" id="restartBtn">もういちどちょうせん</button>
                    <button class="level-change-btn" id="levelChangeBtn">レベルをかえてちょうせん</button>
                    <button class="quit-game-btn" id="quitGameBtn">ゲームしゅうりょう</button>
                `;
                
                // ボタンのイベントリスナーを追加
                setTimeout(() => {
                    document.getElementById('levelChangeBtn').addEventListener('click', () => {
                        this.showLevelSelect();
                    });
                    document.getElementById('quitGameBtn').addEventListener('click', () => {
                        this.quitGame();
                    });
                }, 100);
            } else {
                gameOverButtons.innerHTML = `
                    <button class="restart-btn" id="restartBtn">もういちどちょうせん</button>
                `;
            }
        } else {
            gameOverTitle.textContent = 'ゲームオーバー';
            gameOverTitle.style.color = '#dc3545';
            gameOverMessage.textContent = `がんばったね！スコア: ${this.score}`;
            gameOverButtons.innerHTML = `
                <button class="restart-btn" id="restartBtn">もういちどちょうせん</button>
            `;
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
        this.usedMonsters = []; // 使用済みモンスターリストをリセット
        this.lastProblem = null; // 前回の問題をリセット
        this.advancedBossEvolved = false; // 進化フラグをリセット

        
        // レベルに応じてモンスター配列を再設定
        if (this.selectedLevel === 'beginner') {
            this.monsters = this.beginnerMonsters;
        } else if (this.selectedLevel === 'intermediate') {
            this.monsters = this.intermediateMonsters;
        } else if (this.selectedLevel === 'advanced') {
            this.monsters = this.advancedMonsters;
        }
        
        // タイマーを停止
        this.stopTimer();
        
        // ゲームオーバー画面を非表示
        document.getElementById('gameOverScreen').style.display = 'none';
        
        // ボタンを元に戻す
        document.getElementById('gameOverButtons').innerHTML = `
            <button class="restart-btn" id="restartBtn">もういちどちょうせん</button>
        `;
        
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
            // レベルに応じたボスを選択
            if (this.selectedLevel === 'beginner') {
                this.currentMonster = this.beginnerMidBoss;
                this.monsterHp = this.beginnerMidBoss.hp;
                this.maxMonsterHp = this.beginnerMidBoss.hp;
            } else if (this.selectedLevel === 'intermediate') {
                this.currentMonster = this.intermediateMidBoss;
                this.monsterHp = this.intermediateMidBoss.hp;
                this.maxMonsterHp = this.intermediateMidBoss.hp;
            } else if (this.selectedLevel === 'advanced') {
                this.currentMonster = this.advancedStageBoss;
                this.monsterHp = this.advancedStageBoss.hp;
                this.maxMonsterHp = this.advancedStageBoss.hp;
            }
            this.updateMessage(`ちゅうボス ${this.currentMonster.name}があらわれた！きをつけろ！`);
        } else if (stage === 10) {
            // レベルに応じたステージ10ボスを選択
            if (this.selectedLevel === 'intermediate') {
                this.currentMonster = this.intermediateStageBoss;
                this.monsterHp = this.intermediateStageBoss.hp;
                this.maxMonsterHp = this.intermediateStageBoss.hp;
            } else if (this.selectedLevel === 'advanced') {
                this.currentMonster = this.advancedFinalBoss;
                this.monsterHp = this.advancedFinalBoss.hp;
                this.maxMonsterHp = this.advancedFinalBoss.hp;
            } else {
                this.currentMonster = this.stageBoss;
                this.monsterHp = this.stageBoss.hp;
                this.maxMonsterHp = this.stageBoss.hp;
            }
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
    
    showEvolutionEffect() {
        // 進化エフェクトを表示
        const evolutionOverlay = document.getElementById('evolutionOverlay');
        const monsterImage = document.getElementById('monsterImage');
        
        // モンスター画像に進化エフェクトを適用
        monsterImage.classList.add('evolution-effect');
        
        // 進化オーバーレイを表示
        evolutionOverlay.style.display = 'flex';
        
        // 2秒後にエフェクトを終了して最終ボス戦を開始
        setTimeout(() => {
            monsterImage.classList.remove('evolution-effect');
            evolutionOverlay.style.display = 'none';
            this.startEvolvedBossBattle();
        }, 2000);
    }
    
    startEvolvedBossBattle() {
        // 進化後の最終ボス戦を開始
        this.currentMonster = this.advancedEvolvedBoss;
        this.monsterHp = this.advancedEvolvedBoss.hp;
        this.maxMonsterHp = this.advancedEvolvedBoss.hp;
        
        // ボスフラグを確実に設定
        this.currentMonster.isBoss = true;
        
        // モンスターの見た目を更新
        this.updateMonsterAppearance();
        
        // 問題を生成
        this.generateProblem();
        
        // UIを更新
        this.updateUI();
        
        this.updateMessage(`真の最終ボス ${this.currentMonster.name}があらわれた！けっせんだ！`);
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
        
        // ステージ5、10、11の場合はボス背景を設定
        if (this.stage === 5 || this.stage === 10 || this.stage === 11) {
            if (this.selectedLevel === 'intermediate' && this.stage === 5) {
                // 中級レベルステージ5のボス戦
                backgroundImage = 'back_stage2_boss01.png';
            } else if (this.selectedLevel === 'intermediate' && this.stage === 10) {
                // 中級レベルステージ10のボス戦
                backgroundImage = 'back_stage2_boss02.png';
            } else if (this.selectedLevel === 'advanced' && this.stage === 5) {
                // 上級レベルステージ5のボス戦
                backgroundImage = 'back_stage3_boss01.png';
            } else if (this.selectedLevel === 'advanced' && this.stage === 10) {
                // 上級レベルステージ10のボス戦
                backgroundImage = 'back_stage3_boss02.png';
            } else if (this.selectedLevel === 'advanced' && this.stage === 11) {
                // 上級レベルステージ11の隠れボス戦
                backgroundImage = 'back_stage3_boss03.png';
            } else {
                // その他のボス戦はランダムに選択
                const bossBackgrounds = ['back_boss01.png', 'back_boss02.png'];
                backgroundImage = bossBackgrounds[Math.floor(Math.random() * bossBackgrounds.length)];
            }
        }
        // 初級のステージ6以降はback02.pngを使用（ステージ5と10以外）
        else if (this.selectedLevel === 'beginner' && this.stage >= 6) {
            backgroundImage = 'back02.png';
        }
        // 中級レベルはback_srage2.pngを使用
        else if (this.selectedLevel === 'intermediate') {
            backgroundImage = 'back_srage2.png';
        }
        // 上級レベルはback_stage3_01.pngを使用（ステージ1-5）
        else if (this.selectedLevel === 'advanced') {
            if (this.stage >= 6) {
                backgroundImage = 'back_stage3_02.png';
            } else {
                backgroundImage = 'back_stage3_01.png';
            }
        }
        
        // スマホ画面の背景も更新（!importantで強制設定）
        gameContainer.style.setProperty('background-image', `url('./images/${backgroundImage}')`, 'important');
        gameContainer.style.setProperty('background-repeat', 'no-repeat', 'important');
        gameContainer.style.setProperty('background-position', 'center center', 'important');
        gameContainer.style.setProperty('background-size', 'cover', 'important');
        
        // レベル別クラスの付与
        gameContainer.classList.remove('beginner-stage', 'intermediate-stage', 'advanced-stage', 'stage-6-plus');
        if (this.selectedLevel === 'beginner') {
            gameContainer.classList.add('beginner-stage');
        } else if (this.selectedLevel === 'intermediate') {
            gameContainer.classList.add('intermediate-stage');
        } else if (this.selectedLevel === 'advanced') {
            gameContainer.classList.add('advanced-stage');
            // 上級ステージ6以降の場合は追加クラスを付与
            if (this.stage >= 6) {
                gameContainer.classList.add('stage-6-plus');
            }
        }
        
        // デバッグ用ログ
        console.log('背景画像設定:', {
            stage: this.stage,
            selectedLevel: this.selectedLevel,
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
            
            // 中級ボスの場合は特別なクラスを追加
            if (this.selectedLevel === 'intermediate') {
                monsterImage.classList.add('intermediate-boss');
            }
            
            gameContainer.classList.add('boss-battle');
        } else {
            monsterImage.style.backgroundImage = `url('./images/${backgroundImage}')`;
            monsterImage.style.backgroundRepeat = 'no-repeat';
            monsterImage.style.backgroundPosition = 'center center';
            monsterImage.style.backgroundSize = 'cover';
            monsterImage.style.border = '4px solid #f7fafc';
            monsterImage.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
            monsterImage.classList.remove('boss', 'intermediate-boss');
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