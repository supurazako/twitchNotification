import dotenv from 'dotenv';
import { checkTitleChange, checkStreamStatusChange } from './utils/streamInfo.js';
import { testSendStreamStartNotifications, testSendTitleChangeNotifications } from './utils/notifications.js';
import { getTwitchAccessTokenFromSpreadsheet } from './utils/tokens.js';

dotenv.config();

const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchUserId = '605425209';
const twitchUsername = 'oniyadayo';

// TODO: 配信が開始されたら通知を送る

const testMain = async () => {
    try {
        // notifications.testSendTitleChangeNotifications(twitchUsername, 'test title');
        // accessTokenの取得
        const accessToken = await getTwitchAccessTokenFromSpreadsheet();
        
        // 配信状態の確認
        const isStreamStarted = await checkStreamStatusChange(twitchUserId, accessToken, twitchClientId);
        console.log(`isStreamStarted: ${isStreamStarted}`);
        // trueならば、配信が開始されたことを通知
        if (isStreamStarted) {
            await testSendStreamStartNotifications(twitchUsername);
            console.log('sent start notifications');
        }

        // タイトルの変更を確認
        const { isTitleChanged, currentTitle } = await checkTitleChange(twitchUserId, accessToken, twitchClientId);
        console.log(`isTitleChanged: ${isTitleChanged}`);
        // trueならば、タイトルが変更されたことを通知
        if (isTitleChanged) {
            await testSendTitleChangeNotifications(twitchUsername, currentTitle);
            console.log('sent title change notifications');
        }

        // Lambda用の退出処理
        // ここにコードを追加

        process.exit(0);
    } catch (error) {
        console.error('An error occurred while main function:', error);
    }
}

// 新しい実行フロー
// 1. アクセストークンをGSから取得 ←CLEAR！
// 2. 配信状態を確認　←CLEAR！
// 3. 配信が開始されたら通知を送る　←CLEAR！
// 4. タイトルの変更を確認　←CLEAR！
// 5. タイトルが変更されたら通知を送る　←CLEAR！
// 6. AWS Lambdaに実行できるようにする

testMain();