import api from "./api";

export const leadService = {

  getLeads: async () => {
    const res = await api.get("/leads");
    return res.data;
  },

};