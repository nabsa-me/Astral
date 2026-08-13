import DiaryHero from './DiaryHero';
import DiaryEntryCard from './DiaryEntryCard';
import type { ITravelDiary } from '../../domain/entities/social/TravelDiary';
import type { ISharedRoute } from '../../domain/entities/social/SharedRoute';
import type { IUser } from '../../domain/entities/social/User';

interface DiaryViewProps {
  diary: ITravelDiary;
  owner?: IUser | null;
  route?: ISharedRoute | null;
}

export default function DiaryView({ diary, owner, route }: DiaryViewProps) {
  return (
    <div className="diary-view">
      <DiaryHero diary={diary} owner={owner} route={route} />
      <div className="diary-feed">
        {diary.entries.map((entry) => (
          <DiaryEntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
