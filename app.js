import dotenv from 'dotenv';
import fetch from 'node-fetch';
import streamInfo from './utils/streamInfo.js';
import notifications from './utils/notifications.js';

dotenv.config();

const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchUserId = '605425209';
const twitchUsername = 'oniyadayo';
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET;

const getTwitchAccessToken = async () => {
    try {
        const response = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: twitchClientId,
                client_secret: twitchClientSecret,
                grant_type: 'client_credentials'
            })
        });

        const data = await response.json();
        twitchAccessToken = data.access_token;
        setTimeout(getTwitchAccessToken, (24 * 60 * 60 * 1000));
        
    } catch (error) {
        console.error('Error during getiing access token:', error.message);
    }
}

// twitchAccessTokenをグローバル変数として定義
let twitchAccessToken;

// アクセストークンを取得
getTwitchAccessToken();

// TODO: 配信が開始されたら通知を送る

const notificationInterval = async () => {
    try {
        // 配信状態を確認
        const isStreamStarted = await streamInfo.checkStreamStatusChange(twitchUserId, twitchAccessToken, twitchClientId);
        if (isStreamStarted == true) {
            // 配信が開始されたら通知を送る
            notifications.sendNotifications(twitchUsername, '配信が開始されました');
            console.log('sent notifications');
        }
        // タイトルの変更を確認
        const { isTitleChanged, currentTitle } = await streamInfo.checkTitleChange(twitchUserId, twitchAccessToken, twitchClientId);
        if (isTitleChanged == true) {
            try {
                // 通知を送る
                notifications.sendNotifications(twitchUsername, currentTitle);
                console.log('sent notifications');
            } catch (error) {
                console.error('An error occurred while sending notifications:', error);
            }
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

const testNotification = async () => {
    try {
        notifications.testSendTitleChangeNotifications(twitchUsername, 'test title');
    } catch (error) {
        console.error('An error occurred while sending notifications:', error);
    }
}

testNotification();
// setInterval(notificationInterval, 1000 * 10);