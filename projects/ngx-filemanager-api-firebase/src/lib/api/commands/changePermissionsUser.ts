import * as admin from 'firebase-admin';
import { CoreTypes } from 'ngx-filemanager-core/public_api';
import { VError } from 'verror';

export async function SetPermissionsToUser(
  userId: string,
  entity: CoreTypes.FilePermissionEntity
): Promise<CoreTypes.ResultObj> {
  try {
    const currentUser = await admin.auth().getUser(userId);
    const currentClaims = currentUser.customClaims as CoreTypes.UserCustomClaims;
    const newClaims = {
      ...currentClaims
    };
    const alreadyHasEntity =
      newClaims.groups &&
      newClaims.groups.length &&
      newClaims.groups.includes(entity.id);
    if (alreadyHasEntity) {
      return;
    }
    newClaims.groups.push(entity.id);
    await admin.auth().setCustomUserClaims(userId, newClaims);
    console.log(
      'changePermissionsUser: SetPermissionsToUser() successfully changed permissions',
      { userId, entity, currentClaims, newClaims }
    );
  } catch (error) {
    console.error(
      'changePermissionsUser: SetPermissionsToUser() Error setting custom claims',
      { userId, entity }
    );
    throw new VError(error);
  }
}
