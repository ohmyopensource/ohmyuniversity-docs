import type { DefaultTheme } from 'vitepress';
import { gettingStartedSidebar } from './getting-started';
import { projectSidebar } from './project';
import { apiSidebar } from './api';
import { guidesSidebar } from './guides';

export const sidebar: DefaultTheme.SidebarMulti = {
  ...gettingStartedSidebar,
  ...projectSidebar,
  ...apiSidebar,
  ...guidesSidebar,
};
