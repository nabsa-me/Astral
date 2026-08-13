import { useNavigate } from 'react-router';
import { PageShell } from '../../shared/components/pageShell/PageShell';
import { EmptyState } from '../../shared/components/emptyState/EmptyState';
import { DiaryCard } from '../../shared/components/card/DiaryCard';
import { Button } from '../../shared/components/buttons/buttons';
import { useServices } from '../../app/servicesContext';
import { tripPath } from '../../app/appRoutes';
import type { ITravelDiary } from '../../domain/entities/social/TravelDiary';

const DiariesPage = () => {
  const navigate = useNavigate();
  const { getCurrentUser, getDiariesByOwner, getSharedRouteById } = useServices();
  const currentUser = getCurrentUser();
  const diaries = currentUser ? getDiariesByOwner(currentUser.id) : [];

  const openDiary = (diary: ITravelDiary) => {
    if (!diary.sharedRouteId) return;
    const shared = getSharedRouteById(diary.sharedRouteId);
    if (shared?.vacationId) navigate(tripPath(shared.vacationId));
  };

  return (
    <PageShell
      title="Diarios"
      subtitle="Tus diarios de viaje, día a día."
      actions={<Button label="Nuevo diario" disabled />}
    >
      {diaries.length > 0 ? (
        diaries.map((diary) => (
          <DiaryCard
            key={diary.id}
            diary={diary}
            onOpen={diary.sharedRouteId ? () => openDiary(diary) : undefined}
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
