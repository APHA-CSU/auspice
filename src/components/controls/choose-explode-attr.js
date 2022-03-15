import React from "react";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

import { explodeTree } from "../../actions/tree";
import { SidebarSubtitle } from "./styles";
import { controlsWidth } from "../../util/globals";
import CustomSelect from "./customSelect";

/**
 * The available traits to split a tree on are taken as the non-continuous colorings.
 * We should further check that these are defined on (at least some) internal nodes.
 */
@connect((state) => ({
  selected: state.controls.explodeAttr,
  available: state.metadata.colorings,
  showThisUI: !state.controls.showTreeToo
}))
class ChooseExplodeAttr extends React.Component {
  constructor(props) {
    super(props);
    this.change = (value) => {this.props.dispatch(explodeTree(value.value));};
  }
  gatherAttrs() {
    const options = Object.entries(this.props.available)
      .filter(([key, value]) => value.type !== "continuous") // eslint-disable-line no-unused-vars
      .filter(([key]) => key !== "gt")
      .map(([key, value]) => ({value: key, label: value.title || key}));
    if (this.props.selected) {
      options.unshift({value: undefined, label: "Reconstruct"});
    }
    return options;
  }
  render() {
    if (!this.props.showThisUI) return null;
    const { t } = this.props;
    const selectOptions = this.gatherAttrs();
    return (
      <div style={{paddingTop: 5}}>
        <SidebarSubtitle>
          {"[experimental] " + t("sidebar:Explode tree by")}
        </SidebarSubtitle>
        <div style={{width: controlsWidth, fontSize: 14}}>
          <CustomSelect
            value={selectOptions.filter(({value}) => value === this.props.selected)}
            options={selectOptions}
            isClearable={false}
            isSearchable={false}
            isMulti={false}
            onChange={this.change}
          />
        </div>
      </div>
    );
  }
}

const WithTranslation = withTranslation()(ChooseExplodeAttr);
export default WithTranslation;
