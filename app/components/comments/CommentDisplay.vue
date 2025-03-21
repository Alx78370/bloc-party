<script setup lang="ts">
const props = defineProps<{
  blocId: number;
  blocTitle: string;
  blocOwnerId: number;
  commentCount: number;
  customText?: string; // ✅ Texte personnalisé
  hideIfEmpty?: boolean; // ✅ Masquer si `commentCount === 0`
  minComments?: number; // ✅ Afficher seulement si `commentCount >= minComments`
}>();

const isModalOpen = ref(false);
const { comments, fetchComments, deleteComment } = useComment(props.blocId);
const { likeList, fetchLikes } = useLike(props.blocId);

// ✅ Ouvrir la modal et charger les commentaires
const openModal = async () => {
  isModalOpen.value = true;
  if (comments.value.length === 0) {
    await fetchComments();
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};

const commentText = computed(() =>
  props.commentCount === 1
    ? "1 commentaire"
    : `${props.commentCount} commentaires`,
);
</script>

<template>
  <!-- ✅ Conditions d'affichage -->
  <div
    v-if="
      (!hideIfEmpty || commentCount > 0) &&
      (!minComments || commentCount >= minComments)
    "
    class="flex cursor-pointer items-center gap-1 text-sm text-white transition-all duration-300 ease-in-out hover:text-orange-500"
    @click="openModal"
  >
    <!-- ✅ Slot pour personnaliser l'affichage -->
    <slot :comment-count="commentCount">{{ customText || commentText }}</slot>
  </div>

  <!-- ✅ Affichage du composant modal -->
  <BlocModal
    :comments="comments"
    :likes="likeList"
    :is-open="isModalOpen"
    :bloc-id="blocId"
    :bloc-title="blocTitle"
    :bloc-owner-id="blocOwnerId"
    :fetch-comments="fetchComments"
    :fetch-likes="fetchLikes"
    :delete-comment="deleteComment"
    :default-tab="'comments'"
    @close="closeModal"
  />
</template>
