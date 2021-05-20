import { useRouter } from "next/router";

import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Img,
  Spinner,
  Stack,
  StackDivider,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { ToggleButton } from "@material-ui/lab";
import { RiHeartsFill } from "react-icons/ri";
import React from "react";

interface BooksProps {
  id: string;
  volumeInfo: {
    imageLinks?: {
      thumbnail: string;
      small: string;
    };
    title: string;
    description: string;
    publishedDate: string;
    categories: [];
    authors: [];
    pageCount: number;
    publisher: string;
  };
  searchInfo: {
    textSnippet: string;
  };
}

export default function Book() {
  const { query } = useRouter();
  const [result, setResult] = useState<BooksProps>();
  const [selected, setSelected] = React.useState(false);

  useEffect(() => {
    if (query.id) {
      api.get("/v1/volumes/" + query.id).then((data) => {
        setResult(data.data);
      });
    }
  }, [query.id]);

  console.log(selected);

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        {result ? (
          <Box w="90%" maxWidth={1480}>
            <Heading>{result.volumeInfo.title}</Heading>

            <Divider my="6" borderColor="gray.700" />
            <VStack spacing={4} align="stretch">
              <Img
                mt="2"
                w="20%"
                src={
                  result.volumeInfo.imageLinks
                    ? result.volumeInfo.imageLinks.small
                    : "/images/image-notfound.png"
                }
              />
              <Table variant="unstyled" mb="2">
                <Tbody>
                  <Tr>
                    <Td>
                      Autor:{" "}
                      {result.volumeInfo.authors
                        ? result.volumeInfo.authors
                        : "Não informado"}
                    </Td>
                    <Td>
                      Categoria:{" "}
                      {result.volumeInfo.categories
                        ? result.volumeInfo.categories
                        : "Não informado"}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      N. Pgs:{" "}
                      {result.volumeInfo.pageCount
                        ? result.volumeInfo.pageCount
                        : "Não informado"}
                    </Td>
                    <Td>
                      Editora:{" "}
                      {result.volumeInfo.publisher
                        ? result.volumeInfo.publisher
                        : "Não informado"}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      Publicação:{" "}
                      {result.volumeInfo.publishedDate
                        ? result.volumeInfo.publishedDate.substring(0, 4)
                        : "Não informada"}
                    </Td>
                    <Td>
                      Favoritar:{" "}
                      <ToggleButton
                        value="check"
                        selected={selected}
                        onChange={() => {
                          setSelected(!selected);
                        }}
                      >
                        {selected ? (
                          <RiHeartsFill color="red" />
                        ) : (
                          <RiHeartsFill color="white" />
                        )}
                      </ToggleButton>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>

              <Heading size="lg">Descrição</Heading>
              <Text fontSize="md" textAlign="justify">
                {result.volumeInfo.description
                  ? result.volumeInfo.description
                  : "Não informado"}
              </Text>
            </VStack>
          </Box>
        ) : (
          <Spinner color="pink.500" />
        )}
      </Flex>
    </Box>
  );
}
