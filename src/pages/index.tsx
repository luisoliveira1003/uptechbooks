import { useEffect } from "react";
import { api } from "../services/api";

export default function Home() {
  
  useEffect(() => {

      const response = api.get("/v1/volumes?q=javascript+inauthor:keyes&key=AIzaSyAUBxD6q_ArBZFN_vTShoJ91JRZnOlBkZM");
      
      response.then(data => console.log(data));
  }, []);

  return <h1>Hello World!</h1>;
}
