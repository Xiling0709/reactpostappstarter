import { NavLink } from "react-router-dom";
import useBoundStore from "../../store/Store";
import { createStyles, Header, Container, Group, Burger, rem } from '@mantine/core';
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
}));

const Navbar = () => {
  const { classes, cx } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const { logoutService, user } = useBoundStore((state) => state);
  
  const location = useLocation();

  const onLogout = () => {
    logoutService();
  };

const links = !!user ? [
  <NavLink key="home" to="/" className={location.pathname === "/" ? "active" : ""}>
    <h4>Home</h4>
  </NavLink>,
  <NavLink key="posts" to="/posts" className={location.pathname === "/posts" ? "active" : ""}>
    <h4>Posts</h4>
  </NavLink>,
  <NavLink key="create" to="/posts/create" className={location.pathname === "./create" ? "active" : ""}>
    <h4>Create</h4>
  </NavLink>,
  <div key="logout" onClick={onLogout} >
    <h4>Logout</h4>
  </div>
  ] : [
  <NavLink key="home" to="/" exact>
    <h4>Home</h4>
  </NavLink>,
  <NavLink key="login" to="/login">
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
    </Container>
  </Header>);
};

export default Navbar;
