import TimelineItem from '../components/TimelineItem';

interface TimelinePost {
  id: string;
  post_hook: string;
  posted_at: Date;
  x_url: string;
  account: {
    screen_name: string;
    display_name: string;
    profile_image: string;
  };
}

// サーバーコンポーネントでAPIルートを呼び出し、データを取得
async function getTimelineData(): Promise<TimelinePost[]> {
  // 開発環境ではフルURLが必要な場合がある
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/timeline`, {
    cache: 'no-store', // 常に最新のデータを取得
    // または revalidate: 60*5 などで5分おきに更新
  });

  if (!res.ok) {
    throw new Error('Failed to fetch timeline data');
  }
  return res.json();
}

export default async function Home() {
  const timeline = await getTimelineData();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">複数のXアカウント統合タイムライン</h1>
      <div className="space-y-6">
        {timeline.map((post) => (
          // TimelineItem コンポーネントにデータを渡す
          <TimelineItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}