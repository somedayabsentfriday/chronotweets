import { createClient } from 'microcms-js-sdk';
// ... X API client setup

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

// 1. microCMSから Xアカウントリストを取得
const { contents: accounts } = await client.get({
  endpoint: 'x_accounts', // ステップ3-2で作成したエンドポイント
  queries: {
    fields: 'screen_name,display_name,profile_image',
    orders: 'order', // 登録した順序フィールドでソート
  },
});

// 2. 取得したアカウントリストを基に、X APIから各アカウントの最新投稿を取得
const postPromises = accounts.map(async (account) => {
  // X API Clientを使って、account.screen_name の最新投稿を取得する処理
  // 実際には、X APIのユーザータイムラインエンドポイントを呼び出します。
  const xPosts = await fetchXUserTimeline(account.screen_name);

  // 3. 投稿データとアカウント情報を結合
  return xPosts.map(post => ({
    id: post.id_str,
    text: post.text,
    posted_at: new Date(post.created_at),
    account: {
      screen_name: account.screen_name,
      display_name: account.display_name,
      profile_image: account.profile_image,
    }
  }));
});

const allPosts = (await Promise.all(postPromises)).flat();

// 4. すべての投稿を日時でソート（最新が一番上）
allPosts.sort((a, b) => b.posted_at.getTime() - a.posted_at.getTime());

// 5. 「投稿フック」を抽出
const finalTimeline = allPosts.map(post => {
  // 投稿本文 (post.text) から最初の改行、句読点、または一定文字数までを切り出す
  const hook = post.text.split(/[\n。！？]/)[0].trim() + '...';

  return {
    ...post,
    post_hook: hook, // 新たなフックフィールドを追加
    x_url: `https://x.com/${post.account.screen_name}/status/${post.id}`, // Xへの直リンク
  };
});

return Response.json(finalTimeline);