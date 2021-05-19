import { useRouter } from "next/router";

import { Box, Flex, Heading, Img, Spinner } from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

interface BooksProps {
  id: string;
  volumeInfo: {
    imageLinks?: {
      thumbnail: string;
    };
    title: string;
    description: string;
    publishedDate: string;
  };
  searchInfo: {
    textSnippet: string;
  };
}

export default function Book() {
  const { query } = useRouter();
  const [result, setResult] = useState<BooksProps>();

  useEffect(() => {
    if (query.id) {
      api.get("/v1/volumes/" + query.id).then((data) => {
        setResult(data.data);
      });
    }
  }, [query.id]);

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        {result ? (
          <>
            <Heading>{result.volumeInfo.title}</Heading>
            <Img
              mt="2"
              src={
                result.volumeInfo.imageLinks
                  ? result.volumeInfo.imageLinks.thumbnail
                  : "/images/image-notfound.png"
              }
            />
          </>
        ) : (
          <Spinner color="pink.500" />
        )}
      </Flex>
    </Box>
  );
}
