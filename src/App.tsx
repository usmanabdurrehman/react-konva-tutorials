import { ChakraProvider } from "@chakra-ui/react";
import { Draw } from "./Components";

export default function App() {
  return (
    <ChakraProvider>
      <Draw />
    </ChakraProvider>
  );
}
