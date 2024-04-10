
import { render as testingLibraryRender } from '@testing-library/react';
// import "../styles/globals.css";
import {
    MantineProvider,
    ColorSchemeProvider,
    ColorScheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

export function render(ui: React.ReactNode) {
    // const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    //     key: "mantine-color-scheme",
    //     defaultValue: "light",
    //     getInitialValueInEffect: true,
    // });
    // const toggleColorScheme = (value?: ColorScheme) =>
    //     setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

    return testingLibraryRender(<>{ui}</>, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
            // <ColorSchemeProvider
            //     colorScheme={colorScheme}
            //     toggleColorScheme={toggleColorScheme}
            // >
            <MantineProvider
            // theme={{ colorScheme, primaryColor: "cyan", loader: "dots" }}
            // withGlobalStyles
            // withNormalizeCSS
            >
                {children}
            </MantineProvider>
            // </ColorSchemeProvider>
        ),
    });
}

export * from '@testing-library/react';