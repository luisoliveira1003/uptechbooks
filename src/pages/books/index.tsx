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
  Stack,
  StackDivider,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { Input } from "../../components/Form/Input";
import { api } from "../../services/api";
import { GetStaticProps } from "next";

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
}

const listBookFormSchema = yup.object().shape({
  book: yup
    .string()
    .required("Nome do livro é obrigatório")
    .min(2, "No mínimo 2 caracteres"),
});

export default function BookList() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(listBookFormSchema),
  });

  const { errors } = formState;

  // const [search, setSearch] = useState<BookFormData>();
  const [result, setResult] = useState<BookDataProps[]>([]);
  const [apiKey, setApiKey] = useState(
    "AIzaSyAUBxD6q_ArBZFN_vTShoJ91JRZnOlBkZM"
  );

  let maxResults = 5;

  const handleListBook: SubmitHandler<BookFormData> = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    api
      .get(
        "/v1/volumes?q=" +
          values.book +
          "&key=" +
          apiKey +
          "&maxResults=" +
          maxResults
      )
      .then((data) => {
        setResult(data.data.items);
      });
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
            {result.map((book) => (
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

                    <Heading mt="2" fontSize="sm">
                      {book.searchInfo
                        ? book.searchInfo.textSnippet
                        : 'Não informado'}
                    </Heading>
                  </GridItem>
                </Grid>
              </Box>
            ))}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}
