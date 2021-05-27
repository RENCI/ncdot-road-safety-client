import axios from 'axios'

export const views = {
  front: 1,
  left: 5,
  right: 2,
  back: 6,
}

export const api = {
  logout: '/logout/',
  updateAccount: key => `/accounts/update/${ key }/`,
  getImage: (id, dir, downsample) => downsample ? 
    `/get_image_by_name/${ id }${ views[dir] }.jpg` : 
    `/get_original_image_by_name/${ id }${ views[dir] }.jpg`,
  getImageNamesByLocation: (long, lat, count) => `/get_image_names_by_loc/${ long }/${ lat }/${ count }/`,
  getImageMetadata: id => axios.get(`/get_image_metadata/${ id }/`),
  getImageNamesByAnnotation: label => `/get_image_base_names_by_annot/${ label }/`,
  getNextImageNamesForAnnotation: (label, count) => `/get_next_images_for_annot/${ label }/${ count }/`,
  getAllRoutes: () => axios.get(`/get_all_routes/`),
  getRouteInfo: id => axios.get(`/get_route_info/${ id }/`),
  getAnnotationSet: '/get_annotation_set/',
  saveAnnotations: '/save_annotations/',
  getImageAnnotations: id => `/get_image_annotations/${ id }/`,
  getAccountDetails: id => axios.get(`get_user_info/${ id }`),
  getUserAnnotations: id => axios.get(`/get_user_annotation_info/${ id }/`),
  getImagePrediction: (id, feature) => axios.get(`/get_image_prediction/${ id }/${ feature }`),
  getHoldoutTestInfo: {
    tp: (feature, round) => axios.get(`/get_holdout_test_info/${ feature }/${ round }/tp`),
    tn: (feature, round) => axios.get(`/get_holdout_test_info/${ feature }/${ round }/tn`),
    fp: (feature, round) => axios.get(`/get_holdout_test_info/${ feature }/${ round }/fp`),
    fn: (feature, round) => axios.get(`/get_holdout_test_info/${ feature }/${ round }/fn`),
  },
}
