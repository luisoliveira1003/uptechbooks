import { Flex, Heading, Stack } from "@chakra-ui/react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

export default function Welcome() {
  return (
    <Flex direction="column" h="100vh">
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Stack spacing={6}>
          <Heading>Bem vindo ao Books Search</Heading>
          <Heading as="h2" size="md" color="pink.500">
            Clique nas opções do menu a esquerda
          </Heading>
        </Stack>
      </Flex>
    </Flex>
  );
}
