import api from "./api";

export const projectService = {

  getProjects: async () => {
    const res = await api.get("/projects");
    return res.data;
  },

};