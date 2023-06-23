import axios from "axios";

const gameApiFetch = axios.create({
  baseURL: "https://games-test-api-81e9fb0d564a.herokuapp.com/api/",
  headers: {
    "dev-email-address": "ivanblima097@gmail.com"
  }
})

export default gameApiFetch