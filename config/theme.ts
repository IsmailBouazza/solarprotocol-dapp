import { extendTheme, ThemeComponentProps, ThemeConfig } from '@chakra-ui/react'

export const palette = {
  dark: {
    blue1: '#51ceaf',
    blue2: '#16b28b',
    blue3: '#008d63',
    red1: '#e6000d',
    red2: '#cb000b',
    red3: '#720009',
    purp1: '#00468a',
    purp2: '#081561',
    purp3: '#060434',
    purp4: '#05061b',
  },
  light: {
    blue1: '#a4ded7',
    blue2: '#6db5ad',
    blue3: '#36847b',
    red1: '#a33d36',
    red2: '#85221b',
    red3: '#470905',
    purp1: '#1c3a62',
    purp2: '#14153d',
    purp3: '#0e0a20',
    purp4: '#090812',
  },
}
const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}

export const theme = extendTheme(
  {
    fonts: {
      heading: 'Ubuntu, sans-serif',
      body: 'Ubuntu, sans-serif',
    },
    components: {
      Text: {
        baseStyle: (props: ThemeComponentProps) => ({
          color: props.colorMode === 'dark' ? 'white' : 'black',
        }),
      },
      Heading: {
        baseStyle: (props: ThemeComponentProps) => ({
          color: props.colorMode === 'dark' ? 'white' : 'black',
        }),
      },
    },
  },
  config
)
