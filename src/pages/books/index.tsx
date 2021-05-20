import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Img,
  Link,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";

interface BookFormData {
  book: string;
}

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
  searchInfo: {
    textSnippet: string;
  };
  isFavorite: boolean;
}

const listBookFormSchema = yup.object().shape({
  book: yup
    .string()
    .required("Nome do livro é obrigatório")
    .min(2, "No mínimo 2 caracteres"),
});

export default function BookList() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(listBookFormSchema),
  });

  const { errors } = formState;

  const [result, setResult] = useState<BookDataProps[]>([]);
  const [apiKey, setApiKey] = useState(
    "AIzaSyAUBxD6q_ArBZFN_vTShoJ91JRZnOlBkZM"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [pageNumberLimit, setPageNumberLimit] = useState(4);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(4);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

  const handleListBook: SubmitHandler<BookFormData> = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    api
      .get("/v1/volumes?q=" + values.book + "&key=" + apiKey + "&maxResults=40")
      .then((data) => {
        setResult(data.data.items);
      });
  };

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const pages = [];

  for (let i = 1; i <= Math.ceil(result.length / itemsPerPage); i++) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = result.slice(indexOfFirstItem, indexOfLastItem);

  const renderPageNumbers = pages.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <li
          key={number}
          id={number}
          onClick={handleClick}
          className={currentPage === number ? "active" : ""}
        >
          {number}
        </li>
      );
    } else {
      return null;
    }
  });

  const renderData = (result) => {
    return result.map((book) => (
      <Box key={book.id}>
        <Grid
          h="220px"
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(5, 1fr)"
          gap={4}
        >
          <GridItem>
            <Img
              mt="2"
              src={
                book.volumeInfo.imageLinks
                  ? book.volumeInfo.imageLinks.thumbnail
                  : "/images/image-notfound.png"
              }
            />
          </GridItem>

          <GridItem colSpan={4} rowSpan={1}>
            <Link href={`/books/${book.id}`}>
              <Heading rowSpan={1} fontSize="md">
                {book.volumeInfo.title}
              </Heading>
            </Link>
            <Heading mt="2" fontSize="sm">
              {book.volumeInfo.publishedDate
                ? book.volumeInfo.publishedDate.substring(0, 4)
                : "Não informada"}
            </Heading>

            <Text mt="2" fontSize="sm" textAlign="justify">
              {book.searchInfo ? book.searchInfo.textSnippet : "Não informado"}
            </Text>
          </GridItem>
        </Grid>
      </Box>
    ));
  };

  const handleNextBtn = () => {
    setCurrentPage(currentPage + 1);

    if (currentPage + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const handlePrevBtn = () => {
    setCurrentPage(currentPage - 1);

    if ((currentPage - 1) % pageNumberLimit == 0) {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

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
          onSubmit={handleSubmit(handleListBook)}
        >
          <Heading size="lg" fontWeight="normal">
            Buscar livro
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <Flex my="6" maxWidth={1480} mx="auto">
            <Input
              name="book"
              type="text"
              w="97%"
              placeholder="Digite o nome do livro"
              autoComplete="off"
              error={errors.book}
              {...register("book")}
            />

            <Button
              px={["3", "6"]}
              mt="0.5"
              mx="1"
              colorScheme="pink"
              type="submit"
              isLoading={formState.isSubmitting}
            >
              Buscar
            </Button>
          </Flex>

          <VStack
            divider={<StackDivider borderColor="gray.200" />}
            spacing={4}
            align="stretch"
          >
            {renderData(currentItems)}

            {result.length > 0 && (
              <Box>
                <ul className="pageNumbers">
                  <li>
                    <button
                      onClick={handlePrevBtn}
                      disabled={currentPage === pages[0] ? true : false}
                    >
                      &laquo;
                    </button>
                  </li>

                  {renderPageNumbers}

                  <li>
                    <button
                      onClick={handleNextBtn}
                      disabled={
                        currentPage === pages[pages.length - 1] ? true : false
                      }
                    >
                      &raquo;
                    </button>
                  </li>
                </ul>

                <Box mt="4">
                  <strong>{currentPage * itemsPerPage - 4}</strong> -{" "}
                  <strong>{currentPage * itemsPerPage}</strong> de{" "}
                  <strong>{result.length} livros</strong>
                </Box>
              </Box>
            )}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}
