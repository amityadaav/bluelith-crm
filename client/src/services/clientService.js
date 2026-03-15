import api from "./api";

export const clientService = {

  getClients: async () => {
    const res = await api.get("/clients");
    return res.data;
  },

};