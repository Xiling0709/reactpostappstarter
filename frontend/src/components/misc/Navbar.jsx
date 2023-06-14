import { NavLink } from "react-router-dom";
import useBoundStore from "../../store/Store";
import { createStyles, Header, Container, Group, Burger, Switch, useMantineColorScheme, useMantineTheme, rem} from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useLocation } from 'react-router-dom';


const useStyles = createStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('xs')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      
    },
  },

  switch: {
    marginLeft: 'auto', 
  },
}));

const Navbar = () => {
  const { classes, cx } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const { logoutService, user } = useBoundStore((state) => state);
  
  const location = useLocation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const onLogout = () => {
    logoutService();
  };

  const links = !!user ? [
    <NavLink key="home" to="/" className={cx(classes.link, { [classes.linkActive]: location.pathname === "/" })}>
       <h4 style={{ color: 'inherit' }}>Home</h4>
    </NavLink>,
    <NavLink key="posts" to="/posts" className={cx(classes.link, { [classes.linkActive]: location.pathname === "/posts" })}>
      <h4 style={{ color: 'inherit' }}>Posts</h4>
    </NavLink>,
    <NavLink key="create" to="/posts/create" className={cx(classes.link, { [classes.linkActive]: location.pathname === "/posts/create" })}>
      <h4 style={{ color: 'inherit' }}>Create</h4>
    </NavLink>,
    <div key="logout" onClick={onLogout} className={classes.link}>
      <h4 style={{ color: 'inherit' }}>Logout</h4>
    </div>
  ] : [
    <NavLink key="home" to="/" className={cx(classes.link, { [classes.linkActive]: location.pathname === "/" })} exact>
      <h4>Home</h4>
    </NavLink>,
    <NavLink key="login" to="/login" className={cx(classes.link, { [classes.linkActive]: location.pathname === "/login" })}>
      <h4>Login</h4>
    </NavLink>,
  ];
  




 return (
    <Header height={60} mb={120}>
      <Container className={classes.header}>
        <h4>LOGO</h4>
        <Group spacing={5} className={classes.links}>
          {links}
        </Group>
        <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
        <Switch
          checked={colorScheme === 'dark'}
          onChange={() => toggleColorScheme()}
          size="lg"
          onLabel={<IconSun color={theme.white} size="1.25rem" stroke={1.5} />}
          offLabel={<IconMoonStars color={theme.colors.gray[6]} size="1.25rem" stroke={1.5} />}
          className={classes.switch}
        />
      </Container>
    </Header>
  );
};

export default Navbar;
