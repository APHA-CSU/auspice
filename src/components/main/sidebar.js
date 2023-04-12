import React from "react";
import {ThemeProvider} from 'styled-components';
import Controls from "../controls/controls";
import { SidebarContainer, sidebarTheme } from "./styles";

export const Sidebar = (
  {sidebarOpen, width, height, panelsToDisplay, mobileDisplay}
) => {
  return (
    <ThemeProvider theme={sidebarTheme}>
      <SidebarContainer left={sidebarOpen ? 0 : -1 * width} width={width} height={height}>
          <Controls
            mobileDisplay={mobileDisplay}
            mapOn={panelsToDisplay.includes("map")}
            frequenciesOn={panelsToDisplay.includes("frequencies")}
            measurementsOn={panelsToDisplay.includes("measurements")}
          />
      </SidebarContainer>
    </ThemeProvider>
  );
};
