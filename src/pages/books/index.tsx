import {
  Box,
  Button,
  Flex,
  Heading,
  Img,
  Input,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { SearchBox } from "../../components/Header/SearchBox";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";

interface BookDataProps {
  id: string;
  volumeInfo: {
    imageLinks?: {
      thumbnail: string;
    };
    title: string;
    description: string;
    publishedDate: string;
  };
}

export default function BookList() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [book, setBook] = useState("");
  const [result, setResult] = useState<BookDataProps[]>([]);
  const [apiKey, setApiKey] = useState(
    "AIzaSyAUBxD6q_ArBZFN_vTShoJ91JRZnOlBkZM"
  );

  let maxResults = 10;

  function handleChange(event) {
    const book = event.target.value;

    setBook(book);
  }

  function handleSubmit(event) {
    event.preventDefault();

    api
      .get(
        "/v1/volumes?q=" + book + "&key=" + apiKey + "&maxResults=" + maxResults
      )
      .then((data) => {
        setResult(data.data.items);
      });
  }

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            onChange={handleChange}
            placeholder="Buscar livro"
            autoComplete="off"
          />

          <Button type="submit">Search</Button>

          {result.map((book) => (
            <Box>
              <Heading mt="6" fontSize="md">
                {book.volumeInfo.title}
              </Heading>
              <Heading mt="2" fontSize="sm">
                {book.volumeInfo.description}
              </Heading>
              <Heading mt="2" fontSize="sm">
                Data publicação:{" "}
                {book.volumeInfo.publishedDate
                  ? book.volumeInfo.publishedDate.substring(0, 4)
                  : "Não informada"}
              </Heading>
              <Img
                mt="2"
                src={
                  book.volumeInfo.imageLinks
                    ? book.volumeInfo.imageLinks.thumbnail
                    : "/images/image-notfound.png"
                }
              />
            </Box>
          ))}
        </Box>
      </Flex>
    </Box>
  );
}
