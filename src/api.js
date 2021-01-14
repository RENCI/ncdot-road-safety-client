import axios from 'axios'

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
axios.defaults.xsrfCookieName = 'csrftoken'

export const views = {
  front: 1,
  left: 5,
  right: 2,
  back: 6,
}

export const api = {
  logout: '/logout/',
  updateAccount: key => `/accounts/update/${ key }/`,
  getImage: (id, dir) => `/get_image_by_name/${ id }${ views[dir] }.jpg`,
  getImageNamesByLocation: (long, lat, count) => `/get_image_names_by_loc/${ long }/${ lat }/${ count }/`,
  getImageMetadata: id => `/get_image_metadata/${ id }/`,
  getImageNamesByAnnotation: label => `/get_image_base_names_by_annot/${ label }/`,
  getNextImageNamesForAnnotation: (label, count) => `/get_next_images_for_annot/${ label }/${ count }/`,
  getAllRoutes: '/get_all_routes/',
  getRouteInfo: id => axios.get(`/get_route_info/${ id }/`),
  getAnnotationSet: '/get_annotation_set/',
  saveAnnotations: '/save_annotations/',
  getImageAnnotations: id => `/get_image_annotations/${ id }/`
}
