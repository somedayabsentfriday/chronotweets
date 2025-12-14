// TimelinePost インターフェースは Home.tsx と同じ定義
// ...

export default function TimelineItem({ post }: { post: TimelinePost }) {
  return (
    // 投稿全体をクリック可能にするための<a>タグ
    <a href={post.x_url} target="_blank" rel="noopener noreferrer" className="block border-b pb-4 hover:bg-gray-50 transition duration-150">
      <div className="flex items-start space-x-4">
        {/* サムネの表示 */}
        <img
          src={post.account.profile_image}
          alt={`${post.account.display_name}のプロフィール画像`}
          className="w-10 h-10 rounded-full object-cover mt-1"
        />
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            {/* Xアカウント名の表示 */}
            <span className="font-semibold text-lg text-blue-600">
              {post.account.display_name} (@{post.account.screen_name})
            </span>
            {/* 投稿日時の表示 */}
            <span className="text-sm text-gray-500">
              {new Date(post.posted_at).toLocaleString('ja-JP')}
            </span>
          </div>

          {/* 投稿フック（見出し）の表示 */}
          <p className="mt-1 text-gray-800 font-bold leading-relaxed">
            {post.post_hook}
          </p>

          {/* 補足：投稿フックをクリックするとxの投稿のリンクに飛ぶ（全体がリンクになっているため満たされる） */}

        </div>
      </div>
    </a>
  );
}