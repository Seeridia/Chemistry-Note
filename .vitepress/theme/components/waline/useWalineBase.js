import { computed } from "vue";
import { useRoute } from "vitepress";

const serverURL = "https://comment-chemistry-note.seeridia.top";

export const useWalineBase = () => {
  const route = useRoute();
  const path = computed(() => route.path);

  return {
    serverURL,
    route,
    path,
  };
};
