/** @format */

import React from "react";
import { ContentPage, SimpleBox } from "../../../components/Boxes";
import { CardTitle, ContentCard } from "../../../components/Cards";
import { Frm } from "../../../components/Forms";
import { FrmInput } from "../../../components/Inputs";
import history from "../../../utils-lib/history";
import { email, required } from "../../../utils-lib/validators";
import Auth from "../../auth";

export default function EditManager() {
  const onValidApiSuccess = (res: any) => {
    if (res && res.valid) {
      const { email } = res;
      const {
        location: { pathname },
      } = window;
      history.redirectTo(`${pathname}/${email}`);
    }
  };

  return (
    <ContentPage>
      <Auth>
        <SimpleBox>
          <ContentCard>
            <CardTitle>Edit Manager</CardTitle>
            <Frm getOnLoad={false} onSuccess={onValidApiSuccess}>
              <SimpleBox>
                <FrmInput
                  label="Manager Email"
                  name="email"
                  required={true}
                  validators={[required, email]}
                />
              </SimpleBox>
            </Frm>
          </ContentCard>
        </SimpleBox>
      </Auth>
    </ContentPage>
  );
}
