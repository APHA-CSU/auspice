import React from "react";


export const TreeOptionsInfo = (
  <>
    Change various options relating to what information is displayed on the tree.
    <br/>
    Use the <em>Branch Labels</em> drop-down to display number of SNPs for each branch. Toggle the slider to show all values, but this may obscure other information.
    <br/>
    Use the <em>Tip Labels</em> drop-down to select which information is used to label the branches (e.g. Submission (AF) number, Eartag, CPH, etc).
  </>
);

export const MapOptionsInfo = (
  <>
    Change various options relating to how the map is displayed.
    <br/>
    The <em>geographic resolution</em> chooses the values (CPH or County) which define where samples are placed on the map.
  </>
);

export const PanelOptionsInfo = (
  <>
    Control which panels are being displayed and whether to show the tree and the map side-by-side (<em>grid</em>) or expanded (<em>full</em>).
  </>
);

/*export const AnimationOptionsInfo = (
  <>
    Change various options relating to how the animation proceeds.
  </>
);*/


/*export const FrequencyInfo = (
  <>
    <em>Normalize frequencies</em> controls whether the vertical axis represents the entire dataset or only the samples currently visible (e.g. due to filtering).
    This option is not available when data is limited to prevent numerical issues.
  </>
);*/

/*export const MeasurementsOptionsInfo = (
  <>
    Change collection of measurements and various display options for the collection.
  </>
);*/

/*export const ExplodeTreeInfo = (
  <>This functionality is experimental and should be treated with caution!
    <br/>Exploding a tree by trait X means that for each branch where the trait changes value, we will
    prune off the branch and create a separate (sub)tree.
    It works best when the trait doesn&apos;t change value too frequently.
  </>
);*/
