import React from "react";
import {ThemeProvider} from 'styled-components';
import Controls from "../controls/controls";
import { SidebarContainer, sidebarTheme } from "./styles";
import NavBar from "../navBar";

export const Sidebar = (
  {sidebarOpen, width, height, panelsToDisplay, toggleHandler, mobileDisplay, navBarHandler}
) => {
  return (
    <ThemeProvider theme={sidebarTheme}>
      <SidebarContainer left={sidebarOpen ? 0 : -1 * width} width={width} height={height}>
        <NavBar
          sidebar
          mobileDisplay={mobileDisplay}
          toggleHandler={navBarHandler}
          width={width}
        />
        <Controls
            mobileDisplay={mobileDisplay}
            toggleHandler={navBarHandler}
            mapOn={panelsToDisplay.includes("map")}
            frequenciesOn={panelsToDisplay.includes("frequencies")}
            measurementsOn={panelsToDisplay.includes("measurements")}
        />
      </SidebarContainer>
    </ThemeProvider>
  );
};
