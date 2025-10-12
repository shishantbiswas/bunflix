import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { useId } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import type { TRPCRouter } from "@/integrations/trpc/router";
import { getThemeServerFn } from "@/lib/theme";
import Header from "../components/Header";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
  queryClient: QueryClient;
  trpc: TRPCOptionsProxy<TRPCRouter>;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Nextflix",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  loader: () => getThemeServerFn(),
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const id = useId();
  const theme = Route.useLoaderData();
  return (
    <html className={theme} lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <Header />
          {children}
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
          {process.env.NODE_ENV === "production" && (
            <script
              defer
              id={id}
              src="https://umami.service.coolify.bsws.in/script.js"
              data-website-id="37066bad-b029-48d9-bef5-d3e9abb151cc"
            ></script>
          )}
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  );
}
