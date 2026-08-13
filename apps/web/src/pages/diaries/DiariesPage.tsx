import { useNavigate } from 'react-router';
import { PageShell } from '../../shared/components/pageShell/PageShell';
import { EmptyState } from '../../shared/components/emptyState/EmptyState';
import { DiaryCard } from '../../shared/components/card/DiaryCard';
import { Button } from '../../shared/components/buttons/buttons';
import { useServices } from '../../app/servicesContext';
import { diaryPath } from '../../app/appRoutes';

const DiariesPage = () => {
  const navigate = useNavigate();
  const { getCurrentUser, getDiariesByOwner, getSharedRouteById } = useServices();
  const currentUser = getCurrentUser();
  const diaries = currentUser ? getDiariesByOwner(currentUser.id) : [];

  return (
    <PageShell
      title="Diarios"
      subtitle="Tus historias de viaje: fotos, experiencias y reseñas, día a día."
      actions={<Button label="Nuevo diario" disabled />}
    >
      {diaries.length > 0 ? (
        diaries.map((diary) => (
          <DiaryCard
            key={diary.id}
            diary={diary}
            routeTitle={
              diary.sharedRouteId ? getSharedRouteById(diary.sharedRouteId)?.title : undefined
            }
            onOpen={() => navigate(diaryPath(diary.id))}
          />
        ))
      ) : (
        <EmptyState
          icon="menu_book"
          title="Aún no tienes diarios"
          subtitle="Crea un diario para narrar tus viajes y acompañarlos con fotos y mapas."
        />
      )}
    </PageShell>
  );
};

export default DiariesPage;
