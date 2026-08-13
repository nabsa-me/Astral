import { useParams } from 'react-router';
import DiaryView from '../../features/diary/DiaryView';
import { EmptyState } from '../../shared/components/emptyState/EmptyState';
import { useServices } from '../../app/servicesContext';

const DiaryPage = () => {
  const { diaryId } = useParams();
  const { getDiaryById, getUserById, getSharedRouteById } = useServices();
  const diary = diaryId ? getDiaryById(diaryId) : null;

  if (!diary) {
    return (
      <div className="trip-page">
        <EmptyState
          icon="menu_book"
          title="Diario no encontrado"
          subtitle="Puede que se haya movido o que el enlace no sea correcto."
        />
      </div>
    );
  }

  const owner = getUserById(diary.ownerId);
  const route = diary.sharedRouteId ? getSharedRouteById(diary.sharedRouteId) : null;

  return (
    <div className="trip-page">
      <DiaryView diary={diary} owner={owner} route={route} />
    </div>
  );
};

export default DiaryPage;
