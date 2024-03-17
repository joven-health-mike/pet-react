// Copyright 2022 Social Fabric, LLC

import React from "react"
import { IconContext } from "react-icons"
import { Link } from "react-router-dom"
import styled, { css } from "styled-components"
import { spanStyles } from "../styles/mixins"
import { allNavItems, NavItem } from "./navBarItems"

const linkStyles = css`
  text-decoration: none;
  color: white !important;
  font-size: 18px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-radius: 4px;
`

const StyledLink = styled(Link)`
  ${linkStyles}
`

const LinkTitle = styled.span`
  ${spanStyles}
`

const List = styled.ul`
  width: 100%;
  padding-left: 0px;
`

const Wrapper = styled.div`
  background-color: #4891ce;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
`

const ListItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px, 0ps, 8ps, 16px;
  list-style: none;
  height: 60px;

  a {
    ${linkStyles}
  }

  a:hover {
    background-color: #77caf2;
    color: #385aa8;
  }
`

const Navbar: React.FC = () => {
  return (
    <>
      <nav>
        <IconContext.Provider value={{ color: "#fff" }}>
          <Wrapper>
            <List>
              {allNavItems.map((item: NavItem, index: number) => (
                <ListItem key={index}>
                  <StyledLink to={item.path}>
                    {item.icon}
                    <LinkTitle>{item.title}</LinkTitle>
                  </StyledLink>
                </ListItem>
              ))}
            </List>
          </Wrapper>
        </IconContext.Provider>
      </nav>
    </>
  )
}

export default Navbar
