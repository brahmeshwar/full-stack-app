import React, { useState, useLayoutEffect } from "react";
import { ajaxUtils } from "../../../utils-lib/axios-utils";
import { ContentPage, SimpleBox, Box } from "../../../components/Boxes";
import Auth from "../../auth";
import { ContentCard, CardTitle } from "../../../components/Cards";
import {
  Form,
  FrmErrs,
  FormInput,
  FormActions,
} from "../../../components/Forms";
import { IValidatorResult } from "../../../utils-lib/validators";

export default function Billing() {
  const [billingInfo, setBillingInfo] = useState<null | { [k: string]: any }>(
    null
  );
  const [schoolId, setSchoolId] = useState<null | string>(null);
  const [errs, setErrs] = useState<null | IValidatorResult[]>(null);

  const onSchoolIdChange = (e: any) => setSchoolId(e.target.value);
  const onSubmit = (e: any) => {};
  return (
    <ContentPage>
      <Auth>
        <SimpleBox>
          <SimpleBox>
            <ContentCard>
              <CardTitle>Edit Manager</CardTitle>
              {!billingInfo && (
                <Form>
                  <Box>
                    {errs && <FrmErrs errs={errs} />}
                    <FormInput
                      inputType="text"
                      required={true}
                      onChange={onSchoolIdChange}
                      label={"School Id"}
                    />

                    <FormActions
                      onSubmit={{ label: "Submit", onFrmSubmit: onSubmit }}
                    />
                  </Box>
                </Form>
              )}
            </ContentCard>
          </SimpleBox>
        </SimpleBox>
      </Auth>
    </ContentPage>
  );
}