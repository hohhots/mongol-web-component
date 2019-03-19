#!/usr/bin/env bash

# create link from mongol web component packages. 

set -e

packages=(animation  checkbox  elevation  grid-list  line-ripple  radio  slider  tab-indicator  toolbar  auto-init  chips  fab  icon-button  list  ripple  snackbar  tabs  top-app-bar  base  dialog  feature-targeting  image-list  menu  rtl  switch  tab-scroller  typography  button  dom  floating-label  layout-grid  menu-surface  select  tab  textfield  card  drawer  form-field  linear-progress  notched-outline  shape  tab-bar  theme)

for entry in ${packages[@]}
do
  npm link @mongol/$entry
done