import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Img,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { Input } from "../../components/Form/Input";
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

const listBookFormSchema = yup.object().shape({
  book: yup
    .string()
    .required("Nome do livro obrigatório")
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

  const handleListBook: SubmitHandler<BookDataProps> = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(values);
  };

  // function handleSubmitList(event) {
  //   event.preventDefault();

  //   api
  //     .get(
  //       "/v1/volumes?q=" + book + "&key=" + apiKey + "&maxResults=" + maxResults
  //     )
  //     .then((data) => {
  //       setResult(data.data.items);
  //     });
  // }

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

          <Flex my="6" maxWidth={1480}>
            <Input
              name="book"
              type="text"
              w="85%"
              // onChange={handleChange}
              placeholder="Digite o nome do livro"
              autoComplete="off"
              error={errors.book}
              {...register("book")}
            />

            <Button
              px="6"
              mx="6"
              colorScheme="pink"
              type="submit"
              isLoading={formState.isSubmitting}
            >
              Buscar
            </Button>
          </Flex>
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
